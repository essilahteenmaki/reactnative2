import React from 'react';
import { StyleSheet, Text, View,  Image } from 'react-native';


export default function Landing()  {


  return (
  <View style={styles.container}>
      <Text style={styles.h1}>TicketGuru</Text>
      <Text style={styles.p}>Tilaa lippuja TicketGurun järjestämistä tapahtumista. 
      Tapahtumiin voit tutustua Events-sivulta, josta pääset lukemaan lisätietoja
      kustakin tapahtumasta sekä lisäämään haluamasi määrän tiettyä lipputyyppiä
      ostoskoriin - josta voit tilata liput. Tilatut liput tallentuvat Tickets-näkymään.
      Tickets näkymässä lippujesi QR-koodit ovat helposti saatavilla, voit kuunnella tapahtuman 
      soundtrackia sekä etsiä tapahtuman lähellä (5km) sijaitsevia hotelleja</Text>
      <Image
        style={{height: 150, position: 'absolute', bottom: 0}}
        source={require('./pics/party.png')}
      />
  </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: 'peachpuff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  h1: {
    fontSize: 40,
    fontWeight: "bold",
    color: 'white'
  },
  p: {
    fontSize: 15,
    color: 'white',
    width: '80%',
    textAlign: 'center',
    marginBottom: 150    
  }
});