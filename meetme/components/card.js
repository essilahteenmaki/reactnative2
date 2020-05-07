{
    events.map((event) => {
      return (

        <View style={styles.cards}>  
          <Card
            key={event.eventid}
            title={event.name}>
            <Image style={{ height: '30%'}} source={{uri: 'https://images.unsplash.com/photo-1546026502-797e11a59f50?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'}} />
            <Text style={styles.texts}>
              {event.venue} {event.startTime} {event.ticketInventory} {event.price}
            </Text>
            <Button
              icon={<Icon name='code' color='#ffffff' />}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Lue lisää & osta liput' />
          </Card>
        </View>
      );
    })
  }