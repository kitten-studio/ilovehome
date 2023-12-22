import NetInfo from "@react-native-community/netinfo"
import { useState } from "react"
import { Alert, BackHandler } from "react-native"

export class DeviceInfoUtil {
	private static isConnected = false
	/**
	 * 현재 디바이스의 '네트워크 연결상태'를 리스너로 등록하여 '변경(네트워크 상태)'될때 수행이 됩니다.
	 * 해당 이벤트는 디바이스 연결이 되거나 연결이 종료되었을때 한번 수행됩니다.
	 */
	public static checkDeviceNetConListener = () => {
		if (DeviceInfoUtil.isConnected) return
		DeviceInfoUtil.isConnected = true
		// Subscribe
		const unsubscribe = NetInfo.addEventListener((state) => {
			if (!state.isConnected) {
				Alert.alert("네트워크", "네트워크 연결이 끊겼습니다. 디바이스 연결 상태를 확인 후 재시작 해주세요.", [
					{
						text: "확인",
						onPress: () => {
							DeviceInfoUtil.isConnected = false
							BackHandler.exitApp()
						},
					},
				])
			} else {
			}
		})
		// Unsubscribe
		unsubscribe()
	}
}
