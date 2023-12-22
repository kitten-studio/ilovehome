import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

export class DeviceInfos {
	static getSDKVersion(): number {
		try {
			if (Platform.OS !== "android" || typeof Platform.Version !== "number") return 0
			return Platform.Version
		} catch (e) {
			return 0
		}
	}
	static async getTotalRamMemory(): Promise<number> {
		try {
			return await DeviceInfo.getTotalMemory()
		} catch (e) {
			return 0
		}
	}

	static getBundleId(): string {
		try {
			return DeviceInfo.getBundleId()
		} catch (e) {
			return ""
		}
	}

	static getVersion(): string {
		try {
			return DeviceInfo.getVersion()
		} catch (e) {
			return ""
		}
	}

	static getBuildNumber(): string {
		try {
			return DeviceInfo.getBuildNumber()
		} catch (e) {
			return ""
		}
	}
}
