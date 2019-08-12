import React from 'react'
import { StyleSheet, SafeAreaView, View, Text, Button } from 'react-native'

import { scan } from './BleManagerWrapper'

const App = () => {
  return (
    <SafeAreaView style={style.safeAreaView}>
      <Button onPress={scan} title="scan" />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: 'space-around',
  },
})

export default App
