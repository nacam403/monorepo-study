export type Peripheral = {
  id: string
  name: string
}

export type WriteParams = ReadParams & {
  data: number[]
}

export type ReadParams = {
  peripheral: Peripheral
  serviceUUID: string
  characteristicUUID: string
}

export type NotificationParams = ReadParams
