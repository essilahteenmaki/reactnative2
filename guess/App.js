import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';




export default function App() {


  const [nmr, setNmr] = useState('');
  const [result, setResult] = useState('');
  const [random, setRandom] = useState((Math.floor(Math.random() * 100) + 1));
  const [count, setCount] = useState(1);
  const [value, setValue] = useState('');
  
  const guess = () => {
    

    if (Number.parseInt(nmr) < Number.parseInt(random)) {
      setResult("Arvauksesi " + nmr + " on liian pieni")
      setCount(count + 1)
      setNmr('');
  }
    else if (Number.parseInt(nmr) > Number.parseInt(random)) {
        setResult("Arvauksesi " + nmr + " on liian suuri")
        setCount(count + 1)
        setNmr('');
    }
    else {
        setCount(count + 1) 
        Alert.alert("Arvasit "+ count +" kertaa")

        if (value != isNaN){
          sendData();            
        }

        else if (count < value){
          sendData();           
      }

        setRandom((Math.floor(Math.random() * 100) + 1)); 
        setNmr(''); 
        setCount(1);
        setResult('');          

    }
    
  }

  const  sendData = async () => {
    try {
      await AsyncStorage.setItem('getscore', JSON.stringify(count));
      } catch (error) {
      Alert.alert('Error saving data');
      } 
  }

  const readData = async () => {
    try {
    let valuee = JSON.parse(await AsyncStorage.getItem('getscore'));
    setValue(valuee)
    } catch (error) {
    Alert.alert('Error reading data');
    }
    }


  useEffect(()=>{
    readData();
 })




  return (
    <View style={styles.container}>

      <Text>Tulos:  {result} </Text>
     {/* <Text>Tulos:  {random} </Text> */}

      <TextInput onChangeText={nmr => setNmr(nmr)} keyboardType={'numeric'} value={nmr} style={styles.TextInput}/>

      <View style={styles.buttons}>    
      <Button onPress={guess} title=" Arvaa "/>
      </View>

      <Text>Ennätys:  {value} </Text>

    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    height: 40, 
    width: 100,
    borderColor: 'gray', 
    borderWidth: 1 
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})
