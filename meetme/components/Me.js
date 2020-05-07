import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Image, Text, FlatList, ListItem } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';

export default function Events() {

  useEffect(() => {
    getEvents();
  })
  
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  /*
  const getEvents = () => {
    const url = 'https://ticketguru.herokuapp.com/api/events/upcoming'
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
      console.log(responseJson);
      setEvents(responseJson);
    })
    .catch((error) => { 
      Alert.alert('Tapahtumien haku ei onnistunut');
      console.log(error); 
    }); 
   // console.log(events);
  }
*/

  async function getEvents() {
    try {   
         const response = await fetch("https://ticketguru.herokuapp.com/api/events/upcoming", {
         method : 'get',
         mode: 'cors',
         cache : 'no-cache',
         credentials : 'same-origin',
         headers : {
             'Accept': 'application/json',
             'Content-Type' : 'application/json',
         }
         });

         if(response.status === 200){
            const json = await response.json();
            console.log(json);
            setEvents(json)
         } else {
            setError('Ei tapahtumia')
         }

     } catch (error) {
         setError('Tapahtumien haku ei onnistu')
      }
     }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "80%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  return (
  <View style={styles.container}>  
             <Text>{error}</Text>
   

  {
    events.map((event) => (
      <ListItem
        key={event.eventid}
        leftAvatar={{ source: { uri: 'https://images.unsplash.com/photo-1573055418049-c8e0b7e3403b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'} }}
        title={event.name} 
        subtitle={event.venue} 
        bottomDivider
      />
    ))
  }     

{/*
      <FlatList
        data={events}
        style={styles.flat}
        ItemSeparatorComponent={listSeparator}
        keyExtractor={events => events.eventid}
        renderItem = {({event}) =>
          <View>
            <Text>{event.name} {event.venue} {event.startDate} </Text>
            <Image style={{height:40}} source={{uri: 'https://images.unsplash.com/photo-1573055418049-c8e0b7e3403b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'}} />
          </View>
      }/>
    */}  
  </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts : {
    marginVertical: 10
  },
  flat: {
    flex: 2,
    marginTop: '10%'
   }
})