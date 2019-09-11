import { AppRegistry } from 'react-native'
import BleManager from 'react-native-ble-manager'

import App from './src/App'
import { name as appName } from './app.json'

BleManager.start()

AppRegistry.registerComponent(appName, () => App)
