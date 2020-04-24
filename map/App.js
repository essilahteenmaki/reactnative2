import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, KeyboardAvoidingView  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [address, setAddress] = useState('');
  const key = 'WYMZ8sNRZ6QjS7cbGzpNhvWlW87fXzTL';
  const gkey = 'AIzaSyDWufCkxUL-Kx8JQ7D6wE1o2JxJ1BGJiU0';
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [longLat, setLongLat] = useState([]);
  const [txt, setTxt] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getLocation();
    }, []);



  const find = () => {
    setMarkers([]);
    let street = encodeURI(address);
    const url = 'https://www.mapquestapi.com/geocoding/v1/address?key='+key+'&street='+street+'+&country=finland&maxResults=1';
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
        console.log(responseJson);
       // setLongLat(responseJson.results[0].locations[0].latLng.lat); 
       setLat(Number(responseJson.results[0].locations[0].latLng.lat)); 
       setLng(Number(responseJson.results[0].locations[0].latLng.lng)); 
       

    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 
  }

  const restaurants = () => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='+gkey+'&location='+lat+','+lng+'&radius=500&type=restaurant'
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 

      //make list for markers
      setMarkers(responseJson.results)

    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 
  }

  const getLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
      if (status == 'granted' && locationServicesEnabled) {

        let location = await Location.getCurrentPositionAsync({});
        setLat(Number(location.coords.latitude));
        setLng(Number(location.coords.longitude));
      }
      else {
        Alert.alert('Sijaintitiedot ei sallittu');
      }
    };
    
  


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
              
              {markers.map(marker => (
                  <Marker
                  key={marker.id}
                  coordinate={{latitude: Number(marker.geometry.location.lat), longitude: Number(marker.geometry.location.lng)}}
                  title={marker.name}
                />
            ))}

        </MapView>


      <KeyboardAvoidingView style={styles.keyboard} behavior='padding' enabled>

            <Text>{txt}</Text>
        <TextInput 
          value={address} 
          style={styles.input}
          onChangeText={(address) => setAddress(address)} 
        />
        <Button title="Find from Finland" onPress={find} />
        <Button title="Find restaurants nearby" onPress={restaurants} />

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
      top: 20,
      left: 0,
      right: 0,
      height: '80%'
    },
    keyboard: {
      flex: 2,
      position: 'absolute',
      bottom: 10,
      backgroundColor: 'white',
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