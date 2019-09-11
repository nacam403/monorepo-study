export const WEIGHT_SCALE_SERVICE_UUID = '181D'

export const DATE_TIME_CHARACTERISTIC_UUID = '2A08'
export const WEIGHT_MEASUREMENT_CHARACTERISTIC_UUID = '2A9D'

export const createDataTimeCharacteristicValue = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const buffer = new ArrayBuffer(2 + 1 + 1 + 1 + 1 + 1)
  const view = new DataView(buffer)
  let offset = 0

  view.setUint16(offset, year, true)
  offset += 2

  view.setUint8(offset, month)
  offset++

  view.setUint8(offset, day)
  offset++

  view.setUint8(offset, hour)
  offset++

  view.setUint8(offset, minute)
  offset++

  view.setUint8(offset, second)

  const unsignedInt8Array = new Uint8Array(view.buffer)
  // react-native-ble-managerのwrite()のdata引数は、Uint8Array型だと動かないらしい。
  // number[]に変換する必要がある。
  return Array.from(unsignedInt8Array)
}
