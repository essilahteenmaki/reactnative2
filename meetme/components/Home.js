import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Events from './Events';
import OneEvent from './OneEvent';

const Stack = createStackNavigator();

export default function Home() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Events" component={Events} /> 
        <Stack.Screen name="Details" component={OneEvent} /> 
      </Stack.Navigator>
  );
}
