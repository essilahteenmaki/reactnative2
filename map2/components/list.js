import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

import {Button, ListItem, Header, Input } from 'react-native-elements';

const db = SQLite.openDatabase('myplaces.db');

export default function List({ navigation }) {

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists places (id integer primary key not null, address text);');
    });
    update();    
  }, []);

  const update = () => {
    db.transaction(tx => {
      tx.executeSql('select * from places;', [], (_, { rows }) =>
        setPlaces(rows._array)
      ); 
    });
  }

  const save = () => {
    db.transaction(tx => {
      tx.executeSql('insert into places (address) values (?);', [place]);
    }, null, update)
    setPlace('');
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from places where id = ?;', [id]);
    }, null, update)
  }

  const [places, setPlaces] = useState([]);
  const [place, setPlace] =useState('');


  return (
    <View>

        <Header
          placement="center"
          centerComponent={{ text: 'My places', style: { color: 'white' } }}
        />
    
        <Input placeholder='Address' onChangeText={(place) => setPlace(place)} value={place} />
    
        <View>
        <Button title="Save to favourites" onPress={save} />
        </View>

        <FlatList
        data={places}
        keyExtractor={item => item.id.toString()}
        renderItem = {({item}) => (
            <ListItem
            title={item.address}
            rightTitle='Show Map'
            bottomDivider
            chevron={{color: 'black'}}
            onPress={() => navigation.navigate('Map', {address: item.address})}
            onLongPress={() => deleteItem(item.id)}
            />
        )}
      />
 
    </View>
  );
  
}


//not used atm
const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',

  },
})
