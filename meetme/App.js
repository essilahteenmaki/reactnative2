import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './components/Home'
import Basket from './components/Basket'
import Tickets from './components/Tickets'
import Landing from './components/Landing'
import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{activeTintColor: 'peachpuff'}}
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            let iconName;

            if (route.name === 'Events') {
              iconName = 'md-star-outline'
            } else if (route.name === 'Basket') {
              iconName = 'ios-cart'
            }
            else if (route.name === 'Tickets') {
              iconName = 'ios-wallet';
            }
            else if (route.name === 'Landing') {
              iconName = 'ios-information-circle-outline';
            }
            return <Ionicons size={20} name={iconName} color='peachpuff'/>;
          },
        })}
      >
        <Tab.Screen name="Landing" component={Landing} />       
        <Tab.Screen name="Events" component={Home} />
        <Tab.Screen name="Basket" component={Basket} />
        <Tab.Screen name="Tickets" component={Tickets} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
