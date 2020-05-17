import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SQLite from 'expo-sqlite';
import { Audio } from 'expo-av';
import * as SMS from 'expo-sms';

const tickets = SQLite.openDatabase('tickets.db');
//const soundObject  = new Audio.Sound();

export default function Tickets() {

    useEffect(() => {
      update();
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true
      });
        });
  
  const [mytickets, setMytickets] = useState([]);
  const [soundObject] = useState(new Audio.Sound());
  const [playing, setPlaying] = useState(false); 
  let key = Expo.Constants.manifest.extra.apikey;
  let gkey = Expo.Constants.manifest.extra.gkey;
  const [hotels, setHotels] = useState([]);


  const update = () => {
    tickets.transaction(tx => {
      tx.executeSql('select * from tickets;', [], (_, { rows }) =>
      setMytickets(rows._array)
      ); 
    });
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  const deleteAll = () => {
    tickets.transaction(tx => {
      tx.executeSql('delete from tickets;');
    }, null, update)
  }


  const listen = async (eventname) => {

    try {
      if (playing) {
        await soundObject.stopAsync();
        setPlaying(false);
      } else {
        soundObject.unloadAsync()
          if (eventname.includes("uisrock")) {
            await soundObject.loadAsync(require('./sounds/ruisrock.mp3'));
            } else {
              await soundObject.loadAsync(require('./sounds/syksy.mp3'));           
            }
        await soundObject.playAsync();
        setPlaying(true);
      }
    } catch (error) {
      console.log(error);
    }
    }


  

    const send = async (ticketcode) => {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          ['0405865997'],
          JSON.stringify(ticketcode)
        );
      } else {
        Alert.alert('Ei voida lähettää');
      }
    }


    const hotel = (venue) => {
      const tempArray = venue.split(":");
      const city = tempArray[0];
      const street = tempArray[1];
      const url = 'https://www.mapquestapi.com/geocoding/v1/address?key='+key+'&street='+encodeURI(street)+'+&city='+city+'&country=finland&maxResults=1';
      fetch(url)
      .then((response) => response.json())
      .then((responseJson) => { 
        const googleurl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='+gkey+'&location='
        +(responseJson.results[0].locations[0].latLng.lat)+','
        +(responseJson.results[0].locations[0].latLng.lng)+
        '&radius=5000&type=lodging'
        fetch(googleurl)
        .then((response) => response.json())
        .then((responseJson) => { 
          setHotels(responseJson.results) 
        })
      })
      .catch((error) => { 
        Alert.alert('Osoitteen haku ei onnistu' , error); 
      }); 

    }


  return (
    
  <View style={styles.container}> 
    <View style={styles.ticketcontainer}> 
      <FlatList
          data={mytickets}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={listSeparator}
          renderItem = {({item}) =>
          <View style={styles.ticketitem}>
              <View style={styles.qr}>
                <QRCode value={item.ticketcode} size={120}></QRCode>  
                <Text style={{lineHeight: 25, fontSize:20}}>{item.eventname}</Text>
                <Text style={{lineHeight: 20, fontSize:15}}>{item.venue} </Text>
              </View>
              <View style={styles.options}>
                <Button icon={ <Icon name="play" size={15} style={{color: 'white'}} />} style={styles.button} 
                        title=" Stop & Play"
                        onPress={() => {listen(item.eventname)}} buttonStyle={{ backgroundColor: 'peachpuff' }} />  
                <Button style={styles.button}  title="Lippukoodi SMS" onPress={() => {send(item.ticketcode)}} buttonStyle={{ backgroundColor: 'peachpuff' }} />
                <Button style={styles.button}   title="Etsi hotelli" onPress={() => {hotel(item.venue)}} buttonStyle={{ backgroundColor: 'peachpuff' }} />                           
              </View>
            </View>
        }/>
    </View>
    <View style={styles.hotelcontainer}>
      {hotels.length > 0 &&
            <FlatList
            data={hotels}
            ItemSeparatorComponent={listSeparator}
            keyExtractor={item => String(item.id)}
            renderItem = {({item}) =>
            <View style={styles.ticketitem}>
                <Text style={{lineHeight: 25}}>{item.name}: {item.vicinity}, {item.rating} tähteä</Text>                    
            </View>
          }/>
      }  
    </View>

    <View style={styles.buttons}>    
      <Button title="Poista kaikki liput" onPress={deleteAll} style={styles.button}  buttonStyle={{ backgroundColor: 'peachpuff' }} />  
    </View>

   </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 10
  },
  buttons: {
    flexDirection: "row",
    alignItems: 'center',
  },
  button: {
    width: 180,
    marginVertical: 2
  },
  ticketitem: {
    flexDirection: "row",
  },
  qr: {
    padding: 10,
    width: '50%'
  },
  options: {
    padding: 10,
    width: '50%'
  },
  hotelcontainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10
  },
  ticketcontainer:{
    flex: 3,
  }
})