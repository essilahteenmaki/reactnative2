import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Keyboard } from 'react-native';
import * as SQLite from 'expo-sqlite';

import {Button, ListItem, Header, Input } from 'react-native-elements';

const db = SQLite.openDatabase('list.db');

export default function App() {

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, item text, pcs text);');
    });
    update(); 


  }, []);



  const update = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item;', [], (_, { rows }) =>
        setItems(rows._array)
      ); 
    });
  }


  const [items, setItems] = useState([]);
  const [item, setItem] =useState('');
  const [pcs, setPcs] = useState('');


  const save = () => {
    db.transaction(tx => {
      tx.executeSql('insert into item (item, pcs) values (?, ?);', [item, pcs]);
    }, null, update)
    setPcs('');
    setItem('');
    Keyboard.dismiss();
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from item where id = ?;', [id]);
    }, null, update)
  }



  return (
    <View>

      <Header
        backgroundColor = "pink"
        placement="center"
        centerComponent={{ text: 'SHOPPING LIST', style: { color: 'white', fontSize: 20 } }}
      />

        <View style={styles.container}> 


            <Input placeholder='Tuote' onChangeText={(item) => setItem(item)} value={item} />
            <Input placeholder='Määrä' onChangeText={(pcs) => setPcs(pcs)} value={pcs} />

            <View style={styles.button}> 
              <Button type="outline"  title="ADD" onPress={save} buttonStyle={{ backgroundColor: 'pink' }} titleStyle={{ color: 'white' }} />
            </View>

          <View style={styles.list}>

              <FlatList
              data={items}
              keyExtractor={item => item.id.toString()}
              renderItem = {({item}) => (
                  <ListItem
                  title={item.item}
                  subtitle={item.pcs}
                  rightTitle='Bought'
                  bottomDivider
                  chevron={{color: 'black'}}
                  onPress={() => deleteItem(item.id)}
                  />
              )}
            />
        

        </View>
      </View>
    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    padding: 10
  },
button: {
  margin: 10
}
})