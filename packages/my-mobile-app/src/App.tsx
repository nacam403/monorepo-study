import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'

const App = () => (
  <View style={{ flex: 1 }}>
    <AppContainer />
    <SafeAreaView style={{ backgroundColor: '#F5FCFF' }} />
  </View>
)

export default App

const Home = () => (
  <View style={styles.container}>
    <Text style={styles.text}>テキスト</Text>
    <Text style={styles.text}>テキスト</Text>
  </View>
)

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
  },
  {
    defaultNavigationOptions: {
      title: 'ヘッダー',
    },
  },
)

const AppContainer = createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 25,
  },
})
