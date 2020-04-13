import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';


export default function Historyn({ route, navigation })  {

    const {data} = route.params;


  return (
    <View style={styles.container}>


        <FlatList
          data={data}
          renderItem={({item}) => (
          <Text> {item.text} </Text>
          )}
        />


    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  }
});
