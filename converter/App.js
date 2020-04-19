import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, View, Button, TextInput, Picker } from 'react-native';

export default function App() {

  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(''); 
  const [selectedValue, setSelectedValue] = useState('');
  const [allRates, setAllRates] = useState([]);
  //const [key, setKey] = useState('x') vaihdoin apia koska currencylayerin ilmaisessa saa ilmeisesti vain source=usd

  useEffect(()=>{
    getRates();
 }, [])


  const getRates = () => {
    //const url = 'http://api.currencylayer.com/list?access_key='+key;
    // ylläolevan apin takaa saa ilmaisella versiolla ratet ilmeisesti vain USD:n sourcella, siksi käytän toista urlia.
    const url = 'https://api.exchangeratesapi.io/latest'
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
      console.log(responseJson.rates);
      setAllRates(responseJson.rates)
    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    }); 
  }

  const convert = () => {
    console.log(amount);
    console.log(selectedValue);
    console.log((amount / selectedValue).toFixed(5));
    setTotal((amount / selectedValue).toFixed(5) + ' euroa');
  }


  return (
    <View style={styles.container}>

<Image style={{width:70, height:70}} source={{uri: 'https://live.staticflickr.com/7113/7027584837_6750e02f17_b.jpg'}} />


      <Text>Tulos: {total}  </Text>

      <TextInput style={styles.TextInput} keyboardType="numeric" placeholder="Anna summa jonka haluat muuttaa: " value={amount}  onChangeText={(amount) => setAmount(amount)} />

      <Picker
        selectedValue={selectedValue}
        style={{ height: 40, width: 220 }}
        onValueChange={(itemValue) => { setSelectedValue(itemValue) }}>

          <Picker.Item key={'unselectable'} label='Valitse valuutta' value={0} />

	            {Object.keys(allRates).map((rate) => {
	              return <Picker.Item label={rate} value={allRates[rate]} key={rate} />
	              })
	            }

      </Picker>

      <View style={styles.buttons}>
         <Button title="Euroiksi" onPress={convert} />
     </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "column",
    //flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  TextInput: {
    height: 40, 
    width: 220,
    borderColor: 'gray', 
    borderWidth: 1,
    marginVertical: 2 
  },
  buttons: {
    width: 220,
    marginVertical: 5 
  },
  list: {
    alignItems: 'center', 
    marginVertical: 2    
  }
});