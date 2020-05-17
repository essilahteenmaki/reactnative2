import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const basket = SQLite.openDatabase('basketfortickets.db');
const tickets = SQLite.openDatabase('tickets.db');

export default function Basket()  {

  useEffect(() => {
    update(); 
    });

  useEffect(() => {
    newOrder(); 
    tickets.transaction(tx => {
      tx.executeSql('create table if not exists tickets (id integer primary key not null, eventname text, venue text, ticketcode text);');
    });
    }, []);

 
const [items, setItems] = useState([]);  
const [orderid, setOrderid] = useState([]);
const [errormessage, setErrormessage] = useState([]);

const update = () => {
  basket.transaction(tx => {
    tx.executeSql('select * from basket;', [], (_, { rows }) =>
      setItems(rows._array)
    ); 
  });
}

const deleteItem = (id) => {
  basket.transaction(tx => {
    tx.executeSql('delete from basket where id = ?;', [id]);
  }, null, update)
}

const deleteAll = () => {
  basket.transaction(tx => {
    tx.executeSql('delete from basket;');
  }, null, update)
}

const newOrder = () => {
    const auth = btoa('niilo:salasana');
    const url = 'https://ticketguru.herokuapp.com/api/orders/'
    fetch(url, {
      method : 'post',
      mode: 'cors',
      cache : 'no-cache',
      credentials : 'same-origin',
      headers : {
          'Accept': 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + auth,
      },
      body : JSON.stringify({})
    })

    .then((response) => response.json())
    .then((responseJson) => { 
      setOrderid(responseJson.orderid)
    })
    .catch((error) => { 
      Alert.alert('Tilausta ei voida tehdä' , error); 
    }); 
  
}


 async function buy() {

  setErrormessage([]);

  for (let i = 0; i < items.length; i++) {
  try {   
       const auth = btoa('niilo:salasana');
       const response = await fetch("https://ticketguru.herokuapp.com/api/events/"+ items[i].eventid +"/tickets" , {
       method : 'post',
       mode: 'cors',
       cache : 'no-cache',
       credentials : 'same-origin',
       headers : {
           'Accept': 'application/json',
           'Content-Type' : 'application/json',
           'Authorization' : 'Basic ' + auth,
       },
       body : JSON.stringify({        
          "pcs": ""+ items[i].pcs +"",
          "orderid": ""+orderid+"",
          "tickettypeid": ""+ items[i].typeid +"",
   
        })                 
       });

      if(response.status === 201){
          const json = await response.json();
            for(let index=0; index < json.length; index++) {
              tickets.transaction(tx => {
              tx.executeSql('insert into tickets (eventname, venue, ticketcode) values (?, ?, ?);', 
              [json[index].event.name, json[index].event.venue, json[index].ticketcode]);
            }, null, null)  
            } 
           

          //for delelopment use  
          setErrormessage( (prevData) => {
            return [
              {text: "OK", key: Math.random()},
              ...prevData
            ]
          } );

      }

       else if(response.status === 400){
        setErrormessage( (prevData) => {
          return [
            {text: "ERROR", key: Math.random()},
            ...prevData
          ]
        } );
      }
      
      else {
        setErrormessage( (prevData) => {
          return [
            {text: "ERROR", key: Math.random()},
            ...prevData
          ]
        } );
      }

   } catch (error) {
       setErrormessage( (prevData) => {
        return [
          {text: "ERROR", key: Math.random()},
          ...prevData
        ]
      } );
   }

  }
  //check if errormessages list contains any errors
  if (!errormessage.includes('ERROR')) {
    notify("OK! :)")
  } else {
    notify("Kaikkien lippujen osto ei onnistunut")
  }

}

const notify = (msg) => {
  Alert.alert(msg);
}


  return (
  <View style={styles.container}>
    
    <Image
        style={{height: 250}}
        source={require('./pics/basket.jpg')}
      />

    {/*
    {errormessage.map((item) => (
   <Text key={item.key}> {item.text} </Text>
     ))} 
    */}

      <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          style={styles.flat}
          renderItem = {({item}) =>
          <View style={styles.basketitem}>      
              { (item.typeid == 5)
                ? <Text style={{fontSize:20}}>{item.eventname}: {item.pcs} normaalia lippua</Text>
                : <Text style={{fontSize:20}}>{item.eventname}: {item.pcs} alennettua lippua</Text>
              }
              <Button onPress={() => deleteItem(item.id)} title="Poista" buttonStyle={{ backgroundColor: 'peachpuff' }} />
            </View>
        }/>

    <View style={styles.buttons}>
      <Button title="Tilaa liput" onPress={buy} style={{paddingHorizontal: 5}} buttonStyle={{ backgroundColor: 'peachpuff' }} />
      <Button title="Tyhjennä kori" onPress={deleteAll} buttonStyle={{ backgroundColor: 'peachpuff' }} />
    </View>

  </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 10,
    paddingTop: 30
  },
  buttons: {
    flexDirection: "row",
    alignItems: 'center',
  },
  basketitem: {
    marginVertical: 10
  }
});