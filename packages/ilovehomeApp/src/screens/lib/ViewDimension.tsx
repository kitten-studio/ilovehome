import { Dimensions, Platform, StatusBar } from "react-native"

export class ViewDimension {
	static get() {
		const window = Dimensions.get("window")
		const screen = Dimensions.get("screen")
		return window && window.width ? window : screen
	}
}
