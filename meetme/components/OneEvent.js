import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Picker, Alert } from 'react-native';
import { Button, Card, Input  } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const basket = SQLite.openDatabase('basketfortickets.db');

export default function OneEvent({ route, navigation })  {

    useEffect(() => {
      basket.transaction(tx => {
        tx.executeSql('create table if not exists basket (id integer primary key not null, eventname text, eventid text, pcs text, typename text, typeid text);');
      });
    }, []);

    const {item} = route.params;
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedPcs, setSelectedPcs] = useState('');



        const addBasket = () => {
          let stringteventid = JSON.stringify(item.eventid);
          basket.transaction(tx => {
            tx.executeSql('insert into basket (eventname, eventid, pcs, typeid) values (?, ?, ?, ?);', 
            [item.name, stringteventid, selectedPcs, selectedValue]);
          }, null, notify("Lisätty koriin!"))         
        }


        const notify = (msg) => {
          Alert.alert(msg);
        }

  return (
    <View style={styles.container}>  
      <View style={styles.card}>  
        <Card
            key={item => String(item.eventid)}
            title={item.name}
           >
            <Image style={{ height: 150}} source={{uri: 'https://cdn.pixabay.com/photo/2020/03/20/12/28/party-4950504_960_720.jpg'}} />
            <Text style={styles.texts}>
            Mitä: {item.description} 
            </Text>
            <Text style={styles.texts}>
            Missä: {item.venue}
            </Text>
            <Text style={styles.texts}>
            Koska: {item.startTime} 
            </Text>
            <Text style={styles.texts}>
            Lippuja jäljellä: {item.ticketInventory}
            </Text>
            <Text style={styles.texts}>
            Perushinta: {item.price}
            </Text>
          </Card>
        </View>

        <View style={styles.buy}>      
          <Picker
              selectedValue={selectedPcs}
              itemStyle={{height: 50}}
              onValueChange={(itemValue, itemIndex) => setSelectedPcs(itemValue)}
            >
              <Picker.Item label="Lippujen lkm (scrollaa alas):" value="0" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>

            <Picker
              selectedValue={selectedValue}
              itemStyle={{height: 50}}
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="Lipputyyppi (scrollaa alas):" value="0" />
              <Picker.Item label="Normaali" value="5" />
              <Picker.Item label="Lapsi" value="6" />
              <Picker.Item label="Opiskelija" value="7" />
            </Picker>

            <Button title="Lisää koriin" onPress={addBasket} buttonStyle={{ backgroundColor: 'peachpuff' }} style={{marginTop: 30}} />

        </View>
  </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  cards: {
    paddingTop: 10
  },
  buy: {
    marginTop: 20,
    marginHorizontal: '5%',
    flexDirection: "column",
    justifyContent: 'center',
    alignContent: 'center'
  },
});