import { NativeModules, NativeEventEmitter } from 'react-native'
import BleManager from 'react-native-ble-manager'

import { Peripheral } from './Types'

const emitter = new NativeEventEmitter(NativeModules.BleManager)

const log = (message: string, detail?: Object) => {
  const detailString = detail == null ? '' : JSON.stringify(detail)
  console.log(`BLE: ${message} ${detailString}`)
}

const isExpectedPeripheral = (name?: string) => {
  return name && name.match(/UC-352/)
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

export const connect = (peripheral: Peripheral) => {
  return new Promise(async (resolve, reject) => {
    log('Connecting...', peripheral)

    const timeoutId = setTimeout(() => {
      const errorMessage = 'Connect timeout.'
      log(errorMessage, peripheral)
      reject(new Error(errorMessage))
    }, 5000)

    try {
      await BleManager.connect(peripheral.id)
      log('Connected.', peripheral)
      clearTimeout(timeoutId)
      resolve()
    } catch (e) {
      log('Connect failed.', e)
      clearTimeout(timeoutId)
      reject(e)
    }
  })
}

export const retrieveServices = (peripheral: Peripheral) => {
  return new Promise(async (resolve, reject) => {
    log('Retrieving services...', peripheral)

    const timeoutId = setTimeout(() => {
      const errorMessage = 'Retrieving services timeout.'
      log(errorMessage, peripheral)
      reject(new Error(errorMessage))
    }, 5000)

    const peripheralInfo = await BleManager.retrieveServices(peripheral.id)
    log('Services retrieved.', peripheralInfo)
    clearTimeout(timeoutId)
    resolve(peripheralInfo)
  })
}
