import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Calculator from './components/Calculator.js';
import History from './components/History.js';

const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        <Stack.Screen name="Calculator" component={Calculator} />
        <Stack.Screen name="History" component={History} />     
      </Stack.Navigator>
  </NavigationContainer>
  );
  
}
