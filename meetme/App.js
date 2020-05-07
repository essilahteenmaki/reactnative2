import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Events from './components/Events';
import OneEvent from './components/OneEvent';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

{/*
      <Tab.Navigator>
        <Tab.Screen name="Events" component={Events} />
        <Tab.Screen name="Me" component={Me} />
      </Tab.Navigator>
*/}

      <Stack.Navigator>
        <Stack.Screen name="OneEvent" component={OneEvent} /> 
        <Stack.Screen name="Events" component={Events} /> 
      </Stack.Navigator>

    </NavigationContainer>
  );
}
