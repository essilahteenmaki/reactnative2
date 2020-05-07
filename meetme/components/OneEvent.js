import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Card } from 'react-native-elements';



export default function OneEvent({ route, navigation })  {

  console.log(route.params);
    const {item} = route.params;


  return (
    <View style={styles.container}>

      <Text>{item.eventid}</Text>

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