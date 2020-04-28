import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
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
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from item where id = ?;', [id]);
    }, null, update)
  }


  renderItem = ({ item }) => (
    <ListItem
      title={item.item}
      subtitle={item.pcs}
      bottomDivider
      chevron
    />
  )

  return (
    <View style={styles.container}>
        <Header
          backgroundColor = "pink"
          placement="center"
          centerComponent={{ text: 'Ostoslista', style: { color: 'white' } }}
        />

    
        <Input placeholder='Tuote' onChangeText={(item) => setItem(item)} value={item} />
        <Input placeholder='Määrä' onChangeText={(pcs) => setPcs(pcs)} value={pcs} />
    

      <Button backgroundColor="pink" color="pink"  title="Outline button" onPress={save} />


      <View style={styles.list}>


  {/*    
        <FlatList 
          keyExtractor={item => item.id.toString()}  
          data={items} 
          renderItem={({item}) => 
          <View>
            <Text> {item.item}, {item.pcs}</Text>

            <Text  onPress={() => deleteItem(item.id)}> Bought</Text>

          </View>} 
          /> 
    /*}

      </View>
 
    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingTop: 10
  },
  buttons: {
    color: "#f194ff",
    alignItems: 'center',
    flexDirection: 'row'
  },
  list: {
    padding: 50
  },

})