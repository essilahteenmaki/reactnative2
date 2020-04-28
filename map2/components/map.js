import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, KeyboardAvoidingView  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ route, navigation }) {

  const {address} = route.params;  

  const key = 'WYMZ8sNRZ6QjS7cbGzpNhvWlW87fXzTL';
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  /* to load automaticly location
  useEffect( ()=> {
      find();
  }, [])
*/

  const find = () => {

    let street = encodeURI(address);
    const url = 'https://www.mapquestapi.com/geocoding/v1/address?key='+key+'&street='+street+'+&country=finland&maxResults=1';
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
    console.log(responseJson);
       setLat(Number(responseJson.results[0].locations[0].latLng.lat)); 
       setLng(Number(responseJson.results[0].locations[0].latLng.lng)); 
    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 
  }

    

  return (
    <View style={styles.container}>

        <MapView style={styles.map}
            region={{
              latitude: Number(lat),
              longitude: Number(lng),
              latitudeDelta: 0.322,
              longitudeDelta: 0.321
              }}
            >
              <Marker                
                  coordinate={{latitude: Number(lat), longitude: Number(lng)}} 
                  title='Täsä' 
              /> 
        </MapView>

        <KeyboardAvoidingView style={styles.keyboard} behavior='padding' enabled>
            <Button title="Näytä" onPress={find} />
        </KeyboardAvoidingView>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '80%'
    },
    keyboard: {
      flex: 2,
      position: 'absolute',
      bottom: 50,
      width: '100%',
      alignItems: 'center',
    },
    input: {
      height: 40, 
      width: 200,
      borderColor: 'gray', 
      borderWidth: 1,
    }
});