import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, View, Text, Button } from 'react-native'

import { scan } from './BleManagerWrapper'

const blankPeripheral = {
  id: '-',
  name: '-',
}

const App = () => {
  const [discoveredPeripheral, setDiscoveredPeripheral] = useState(
    blankPeripheral,
  )

  return (
    <SafeAreaView style={style.safeAreaView}>
      <Button
        onPress={async () => {
          const discoveredPeripheral = await scan()
          setDiscoveredPeripheral(discoveredPeripheral || blankPeripheral)
        }}
        title="scan"
      />

      <View>
        <Text>{`Discovered Peripheral ID: ${discoveredPeripheral.id}`}</Text>
        <Text>{`Discovered Peripheral Name: ${
          discoveredPeripheral.name
        }`}</Text>
      </View>
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
