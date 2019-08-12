import { NativeModules, NativeEventEmitter } from 'react-native'
import BleManager from 'react-native-ble-manager'

import { Peripheral } from './Types'

const emitter = new NativeEventEmitter(NativeModules.BleManager)

const log = (message: string, detail?: Object) => {
  const detailString = detail == null ? '' : JSON.stringify(detail)
  console.log(`BLE: ${message} ${detailString}`)
}

const isExpectedPeripheral = (name: string) => {
  // ひとまず、常にtrueを返す。
  return true
}

export const scan = async (): Promise<Peripheral | undefined> => {
  return new Promise(async resolve => {
    const discoverSubscription = emitter.addListener(
      'BleManagerDiscoverPeripheral',
      async (peripheral: Peripheral) => {
        log('Peripheral discovered.', {
          id: peripheral.id,
          name: peripheral.name,
        })

        if (isExpectedPeripheral(peripheral.name)) {
          log('Expected peripheral discovered.')
          removeSubscriptions()

          log('Scan stopping...')
          await BleManager.stopScan()
          log('Scan stopped.')

          resolve(peripheral)
        }
      },
    )

    const scanTimeoutSubscription = emitter.addListener(
      'BleManagerStopScan',
      () => {
        log('Scan stopped by timeout.')
        removeSubscriptions()
        resolve()
      },
    )

    const removeSubscriptions = () => {
      scanTimeoutSubscription.remove()
      discoverSubscription.remove()
    }

    log('Scan starting...')
    await BleManager.scan([], 5)
    log('Scan started.')
  })
}
