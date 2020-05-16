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
                //console.log('fetch good! ', response);
                resolve(response);
            }
        })
        
        .catch(function(err) {
            //console.log('fetch failed! ', err);
            
            // Rejection already happened with setTimeout
            if(didTimeOut) return;
            // Reject with error
            reject(err);
        });

    })

    .then((response) => response.json())
    .then((responseJson) => { 
          //console.log(responseJson);
          setEvents(responseJson);
        })        

    .then(function() {
        // Request success and no timeout
        //console.log('good promise, no timeout! ');
    })
    .catch(function(err) {
        // Error: response error, request timeout or runtime error
        //console.log('promise error! ', err);
    });


  }


  return (

    
  <View style={styles.container}> 
      {events.length > 0 &&
      <FlatList
          data={events}
          keyExtractor={item => String(item.eventid)}
          renderItem = {({item}) =>
          <View style={styles.eventscontainer}>
              <Image style={{height:100}} source={{uri: 'https://images.unsplash.com/photo-1573055418049-c8e0b7e3403b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'}} />
              <Text style={{fontSize:24}}>{item.name} </Text>
               <Text>{item.venue} </Text>
               <Text>{String(item.startTime)} </Text>
               <Button title="Lue lisää" onPress={() => navigation.navigate('Details', {item})} />
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
  eventscontainer : {
    marginVertical: 5
  }
})