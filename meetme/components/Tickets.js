import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import * as SQLite from 'expo-sqlite';
import { Audio } from 'expo-av';
import * as SMS from 'expo-sms';

const tickets = SQLite.openDatabase('tickets.db');

export default function Tickets() {

    useEffect(() => {
      update();
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true
      });
        });
  
  const [mytickets, setMytickets] = useState([]);
  const soundObject = new Audio.Sound();
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
          if (eventname.includes("uisrock")) {
          await soundObject.loadAsync(require('./sounds/ruisrock.mp3'));
          } else {
            await soundObject.loadAsync(require('./sounds/syksy.mp3'));           
          }
          await soundObject.playAsync();
        } catch (error) {
          Alert.alert('Ei voida toistaa');
        }
    }


    const stop = async () => {
      try {    
        await soundObject.stopAsync();
      } catch (error) {
        Alert.alert('Ei voida hiljentää');
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
          renderItem = {({item}) =>
          <View style={styles.ticketitem}>
              <QRCode value={item.ticketcode} size={150}></QRCode>              
              <Text style={{lineHeight: 30, fontSize:15}}>{item.eventname}: {item.venue} </Text>
              <Button style={{width: 210}} type="outline"  title="Kuuntele" onPress={() => {listen(item.eventname)}} />  
              <Button style={{width: 210}} type="outline"  title="Lippukoodi puhelimeen" onPress={() => {send(item.ticketcode)}} />
              <Button style={{width: 210}} type="outline"  title="Etsi hotellia" onPress={() => {hotel(item.venue)}} />                            
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
                <Text>{item.name}: {item.vicinity}, {item.rating} tähteä</Text>                    
            </View>
          }/>
      }  
    </View>

    <View style={styles.buttons}>    
      <Button type="outline"  title="Tyhjennä" onPress={deleteAll} />
      <Button type="outline"  title="Hiljennä" onPress={stop} /> 
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
  ticketitem: {
    padding: 10,
    alignItems: 'center',
  },
  hotelcontainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 35,
    color: 'white',
    paddingVertical: 10
  },
  ticketcontainer:{
    flex: 3,
    color: 'white'
  }
})