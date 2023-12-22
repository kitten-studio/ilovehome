/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native"
import "react-native-gesture-handler"
import { name as appName } from "./app.json"
import App from "./src/App"

if (__DEV__) {
	LogBox.ignoreLogs([
		"[DEPRECATED]",
		"Warning: Each child in a list should",
		"Warning: componentWillUpdate has been renamed",
		"Warning: componentWillMount has been renamed",
		"Warning: componentWillReceiveProps has been renamed",
		"Require cycle: node_modules",
		"Require cycle: ../screens",
		"Require cycle: index.js",
		"new NativeEventEmitter",
		"Non-serializable values were found in the navigation state",
	])
}

AppRegistry.registerComponent(appName, () => App)
console.disableYellowBox = true
