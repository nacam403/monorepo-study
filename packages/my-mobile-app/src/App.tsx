import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const App = () => <Home />

export default App

const Home = () => (
  <View style={styles.container}>
    <Text style={styles.text}>テキスト</Text>
    <Text style={styles.text}>テキスト</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
  },
})
