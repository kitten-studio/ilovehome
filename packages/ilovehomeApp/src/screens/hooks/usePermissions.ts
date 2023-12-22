import { useRef } from "react"
import { Platform } from "react-native"
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions"

export type ResultMaps = (typeof RESULTS)[keyof typeof RESULTS]

export interface PermissionType {
	camera: ResultMaps
}

const usePermissions = () => {
	const permissions = useRef<PermissionType>({
		camera: RESULTS.DENIED,
	}).current

	const PERMISSIONS_CAMERA = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA

	const requestCameraPermission = async () => {
		try {
			let cameraPermission = await check(PERMISSIONS_CAMERA)
			if (cameraPermission === RESULTS.DENIED) {
				cameraPermission = await request(PERMISSIONS_CAMERA)
			}
			permissions.camera = cameraPermission
			if (permissions.camera === RESULTS.GRANTED) return true
			else return false
		} catch (err) {
			console.warn(err)
			return false
		}
	}

	return {
		permissions,
		requestCameraPermission,
	}
}
export default usePermissions
