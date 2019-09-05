import { NativeModules, NativeEventEmitter } from 'react-native'
import BleManager from 'react-native-ble-manager'

import {
  Peripheral,
  WriteParams,
  ReadParams,
  NotificationParams,
} from './Types'

const emitter = new NativeEventEmitter(NativeModules.BleManager)

const log = (message: string, detail?: Object) => {
  const detailString = detail == null ? '' : JSON.stringify(detail)
  console.log(`BLE: ${message} ${detailString}`)
}

const isExpectedPeripheral = (name?: string) => {
  return name && name.match(/UC-352/)
}

const wait = (msec: number = 50) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, msec)
  })
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
    }, 10000)

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
    }, 10000)

    const peripheralInfo = await BleManager.retrieveServices(peripheral.id)
    log('Services retrieved.', peripheralInfo)
    clearTimeout(timeoutId)
    resolve(peripheralInfo)
  })
}

/**
 * Androidの場合、以下のような挙動になる。
 * 1. BleManager.createBondを呼ぶ。
 * 2. OSによるポップアップが端末の画面に表示される。
 * 3. ポップアップ表示と同時に、BleManager.createBondのPromiseはrejectされる。ポップアップの操作完了を待ってはくれない。
 */
const createBond = async (peripheral: Peripheral) => {
  try {
    log('Bonding starting...', { peripheral })
    await BleManager.createBond(peripheral.id)
    log('Bonding succeeded.', { peripheral })
  } catch (e) {
    log('Bonding failed.', e)
    throw e
  }
}

/**
 * ユーザーがポップアップを操作してボンディングが完了するまで、createBondを繰り返す。
 * ボンディング完了後ならば、createBondのPromiseはresolveされることを利用している。
 */
export const createBondWithRetry = async (peripheral: Peripheral) => {
  let retry = 0

  while (true) {
    try {
      await createBond(peripheral)
      return // ボンディング完了
    } catch (e) {
      // ボンディング未了の場合、createBondを呼ぶとすぐにrejectされるので、ここに来る。
      if (retry >= 20) {
        throw e
      }
    }

    // 少しwaitしながらリトライする。そのうちにユーザーがポップアップを操作して、ボンディングが完了するはずだから。
    await wait(1000)
    retry++
  }
}

export const write = async ({
  peripheral,
  serviceUUID,
  characteristicUUID,
  data,
}: WriteParams) => {
  try {
    log('Write starting...', { serviceUUID, characteristicUUID })
    await BleManager.write(peripheral.id, serviceUUID, characteristicUUID, data)
    log('Write succeeded.', { serviceUUID, characteristicUUID })
  } catch (e) {
    log('Write failed.', e)
    throw e
  }
}

export const read = async ({
  peripheral,
  serviceUUID,
  characteristicUUID,
}: ReadParams) => {
  try {
    log('Read starting...', { serviceUUID, characteristicUUID })
    const data = await BleManager.read(
      peripheral.id,
      serviceUUID,
      characteristicUUID,
    )
    log('Read succeeded.', { serviceUUID, characteristicUUID })
    return data
  } catch (e) {
    log('Read failed.', e)
    throw e
  }
}

const startNotification = async ({
  peripheral,
  serviceUUID,
  characteristicUUID,
}: NotificationParams) => {
  try {
    log('Notification/Indication starting...', {
      serviceUUID,
      characteristicUUID,
    })
    await BleManager.startNotification(
      peripheral.id,
      serviceUUID,
      characteristicUUID,
    )
    log('Notification/Indication started.', { serviceUUID, characteristicUUID })
  } catch (e) {
    log('Notification/Indication start failed.', e)
    throw e
  }
}

const stopNotification = async ({
  peripheral,
  serviceUUID,
  characteristicUUID,
}: NotificationParams) => {
  try {
    log('Notification/Indication stoping...', {
      serviceUUID,
      characteristicUUID,
    })
    await BleManager.stopNotification(
      peripheral.id,
      serviceUUID,
      characteristicUUID,
    )
    log('Notification/Indication stopped.', { serviceUUID, characteristicUUID })
  } catch (e) {
    log('Notification stop failed.', e)
    throw e
  }
}

export const startAndStopNotification = async (
  notifiationParams: NotificationParams,
): Promise<Array<number[]>> => {
  return new Promise(async resolve => {
    const receivedValues: number[][] = []

    const notificationSubscription = emitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }: { value: number[] }) => {
        log('Notification/Indication received.', { value })
        receivedValues.push(value)
      },
    )

    try {
      await startNotification(notifiationParams)
      await wait(10000)
      await stopNotification(notifiationParams)
    } catch (e) {
      // エラーは握りつぶし、必ずresolveする。receivedValuesが空配列であっても。
    } finally {
      notificationSubscription.remove()
      resolve(receivedValues)
    }
  })
}

export const disconnect = async (peripheral: Peripheral) => {
  try {
    log('Disconnecting...', peripheral)
    await BleManager.disconnect(peripheral.id)
    log('Disconnected.', peripheral)
  } catch (e) {
    log('Disconnect failed.', e)
    throw e
  }
}
