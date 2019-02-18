import React from 'react'
import { StyleSheet, Text, Button, View, SafeAreaView } from 'react-native'
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation'

const getActiveRouteName = (navigationState: any): any => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

const App = () => (
  <View style={{ flex: 1 }}>
    <AppContainer
      onNavigationStateChange={(prevState, currentState) => {
        const prevScreen = getActiveRouteName(prevState)
        const currentScreen = getActiveRouteName(currentState)

        if (prevScreen !== currentScreen) {
          console.log(currentScreen)
        }
      }}
    />
    <SafeAreaView style={{ backgroundColor: '#F5FCFF' }} />
  </View>
)

export default App

const Home = ({ navigation }: any) => (
  <View style={styles.container}>
    <Button onPress={() => navigation.navigate('A')} title="A" />
    <Button onPress={() => navigation.navigate('B')} title="B" />
    <Button onPress={() => navigation.navigate('C')} title="C" />
    <Text style={styles.text}>Home</Text>
  </View>
)

const A = ({ navigation }: any) => (
  <View style={styles.container}>
    <Button onPress={() => navigation.navigate('Home')} title="Home" />
    <Button onPress={() => navigation.navigate('B')} title="B" />
    <Button onPress={() => navigation.navigate('C')} title="C" />
    <Text style={styles.text}>AAA</Text>
  </View>
)

const B = ({ navigation }: any) => (
  <View style={styles.container}>
    <Button onPress={() => navigation.navigate('Home')} title="Home" />
    <Button onPress={() => navigation.navigate('A')} title="A" />
    <Button onPress={() => navigation.navigate('C')} title="C" />
    <Text style={styles.text}>BBB</Text>
  </View>
)

const C = ({ navigation }: any) => (
  <View style={styles.container}>
    <Button onPress={() => navigation.navigate('Home')} title="Home" />
    <Button onPress={() => navigation.navigate('A')} title="A" />
    <Button onPress={() => navigation.navigate('B')} title="B" />
    <Text style={styles.text}>CCC</Text>
  </View>
)

const AppNavigator = createSwitchNavigator(
  {
    Home: {
      screen: createStackNavigator(
        { Home },
        {
          defaultNavigationOptions: {
            title: 'Home',
          },
        },
      ),
    },
    ABC: {
      screen: createStackNavigator(
        {
          A,
          B,
          C,
        },
        {
          initialRouteName: 'A',
          defaultNavigationOptions: {
            title: 'ヘッダー',
          },
        },
      ),
    },
  },
  {
    initialRouteName: 'Home',
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
