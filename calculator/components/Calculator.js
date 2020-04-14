import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';



export default function Calculator({ navigation })  {


  const [nmr, setNmr] = useState("");
  const [nmr2, setNmr2] = useState("");
  const [result, setResult] = useState("");
  //const [text, setText] = useState("");
  const [data, setData] = useState([]);

 
  const add = () => {
    let sum = parseInt(nmr) + parseInt(nmr2)
    let text = nmr + "+" + nmr2 + "=" + sum;
    setData( (prevData) => {
      return [
        {text: text, key: data.length},
        ...prevData
      ]
    } );
    setResult(sum);
    setNmr('');
    setNmr2('');
  }

  const minus = () => {
    let sum = parseInt(nmr) - parseInt(nmr2)
    let text = nmr + "-" + nmr2 + "=" + sum;    
    setResult(sum);
    setData( (prevData) => {
      return [
        {text: text, key: data.length},
        ...prevData
      ]
    } );
    setNmr('');
    setNmr2('');
  }




  return (
    <View style={styles.container}>

     <View style={styles.result}>
        <Text>Tulos:  {result} </Text>
        <TextInput onChangeText={nmr => setNmr(nmr)} keyboardType={'numeric'} value={nmr} style={styles.TextInput}/>
        <TextInput onChangeText={nmr2 => setNmr2(nmr2)} keyboardType={'numeric'}  value={nmr2} style={styles.TextInput}/>
     </View>

      <View style={styles.buttons}>  
        <View>
            <Button onPress={add} title=" + "/>
        </View>
        <View>
            <Button onPress={minus} title=" - "/>
        </View>
        <View>
            <Button title="Historia" onPress={() => navigation.navigate('History', {data})} />
        </View>
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
  result:{
    paddingTop: 10,
    //flex: 2,
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
    marginVertical: 2 
  },
  buttons: {
    width: 200,
    color: "#f194ff",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    
    //marginTop: 5
  },
  list: {
  }

});