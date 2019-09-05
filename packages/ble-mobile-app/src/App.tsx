import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, View, Text, Button } from 'react-native'

import {
  scan,
  connect,
  retrieveServices,
  createBondWithRetry,
  write,
  read,
  disconnect,
} from './BleManagerWrapper'
import {
  WEIGHT_SCALE_SERVICE_UUID,
  DATE_TIME_CHARACTERISTIC_UUID,
  createDataTimeCharacteristicValue,
} from './WeightScaleUtil'

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

          if (discoveredPeripheral) {
            await connect(discoveredPeripheral)
            await retrieveServices(discoveredPeripheral)

            // TODO if Android
            await createBondWithRetry(discoveredPeripheral)

            const currentDateTime = createDataTimeCharacteristicValue()
            await write({
              peripheral: discoveredPeripheral,
              serviceUUID: WEIGHT_SCALE_SERVICE_UUID,
              characteristicUUID: DATE_TIME_CHARACTERISTIC_UUID,
              bytes: currentDateTime,
            })

            const dateTimeArray = await read({
              peripheral: discoveredPeripheral,
              serviceUUID: WEIGHT_SCALE_SERVICE_UUID,
              characteristicUUID: DATE_TIME_CHARACTERISTIC_UUID,
            })
            console.log(dateTimeArray)
            await disconnect(discoveredPeripheral)
          }
        }}
        title="Paring"
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
