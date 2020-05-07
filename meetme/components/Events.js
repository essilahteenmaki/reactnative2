import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, FlatList } from 'react-native';
import { Button, Icon } from 'react-native-elements';

export default function Events({ navigation }) {

  useEffect(() => {
    getEvents();
  }, [])
  
  const [events, setEvents] = useState([]);


  //Timeout for fetching (slow backend)
  const getEvents = () => {
    const FETCH_TIMEOUT = 50000;
    let didTimeOut = false;

    new Promise(function(resolve, reject) {
        const timeout = setTimeout(function() {
            didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
        
        fetch('https://ticketguru.herokuapp.com/api/events/upcoming')
        .then(function(response) {
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            if(!didTimeOut) {
                console.log('fetch good! ', response);
                resolve(response);
            }
        })
        
        .catch(function(err) {
            console.log('fetch failed! ', err);
            
            // Rejection already happened with setTimeout
            if(didTimeOut) return;
            // Reject with error
            reject(err);
        });

    })

    .then((response) => response.json())
    .then((responseJson) => { 
          console.log(responseJson);
          setEvents(responseJson);
        })        

    .then(function() {
        // Request success and no timeout
        console.log('good promise, no timeout! ');
    })
    .catch(function(err) {
        // Error: response error, request timeout or runtime error
        console.log('promise error! ', err);
    });


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
      {events.length > 0 &&
      <FlatList
          data={events}
          style={styles.flat}
          ItemSeparatorComponent={listSeparator}
          keyExtractor={item => String(item.eventid)}
          renderItem = {({item}) =>
            <View>
              <Image style={{height:100}} source={{uri: 'https://images.unsplash.com/photo-1573055418049-c8e0b7e3403b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'}} />
              <Text>{item.name} </Text>
               <Text>{item.venue} {String(item.startTime)} </Text>
               <Button title="Lue lisää" onPress={() => navigation.navigate('OneEvent', {item})} />
            </View>
        }/>
      } 
   </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts : {
    marginVertical: 10
  },
  cards: {
    width: '30%',
    height: '30%',
    marginVertical: 10
  }
})