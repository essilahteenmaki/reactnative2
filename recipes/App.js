import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';

export default function App() {

  const [ing, setIng] = useState('');
  const [recipes, setRecipes] = useState([]);
  
  
    const [address, setAddress] = useState('');
  const key = 'WYMZ8sNRZ6QjS7cbGzpNhvWlW87fXzTL';
  const [longLat, setLongLat] = useState([]);


  const find = () => {
    //Osoite webbiin
    //const url = 'https://cors-anywhere.herokuapp.com/www.recipepuppy.com/api/?i='+ ing;
    const url = 'http://www.recipepuppy.com/api/?i='+ ing;
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
       if (responseJson.results && responseJson.results.length > 0) {
        setRecipes(responseJson.results); 
        setIng('');
     }else{
      Alert.alert('Hakusanalla ' + ing + ' ei löydy reseptejä, koita esim. tomato hakusanaa' );
      console.log('Ei löydy');
      setIng('');
     }

    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 
  }
  
  
  
    const test = () => {
    let street = encodeURI(address);
	
    const url = 'https://www.mapquestapi.com/geocoding/v1/address?key='+key+'&street='+street+'+&country=finland&maxResults=1';
	console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
        console.log(responseJson);
		console.log(responseJson.results[0].locations[0].latLng);
       //setLongLat(responseJson.results.locations.latLng); 
       //console.log(longLat);
       

    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 

    
  }
  
  
  
  
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "80%",
          backgroundColor: "#CED0CE",
          marginLeft: "10%",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.flat}>
        <FlatList
                  data={recipes}
                  style={styles.flat}
                  ItemSeparatorComponent={listSeparator}
                  keyExtractor={item => item.title}
                  renderItem = {({item}) =>
                  <View>
                  <Text>{item.title}</Text>
                  <Image style={{width:80, height:80}} source={{uri: item.thumbnail}} />
                  </View>
              }/>
      </View>
      <View style={styles.input}>
        <TextInput 
          value={ing} 
          style={styles.TextInput}
          placeholder="Ingredient: "
          onChangeText={(ing) => setIng(ing)
          } 
        />
		
		
		        <TextInput 
          value={address} 
          style={styles.TextInput}
          onChangeText={(address) => setAddress(address)} 
        />

        <Button title="Find recipes" onPress={find} />
		
		
		<Button title="testaaa" onPress={test} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "column",
    flex: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  TextInput: {
    height: 40, 
    width: 200,
    borderColor: 'gray', 
    borderWidth: 1,
    marginVertical: '10%',
  },
  input: {
    flex: 3
  },
  flat: {
   flex: 2,
   marginTop: '10%'
  }
});