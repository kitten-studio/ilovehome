import type { PermissionStatus } from "react-native-permissions"

export type DetailScreen = {
	showPyeong: boolean
	mktSource: string
	areaDanjiId: number
	business: string
	isSsr: boolean
	selectedSalesTypeIndex: number
	selectedRoomTypeIndex: number
	seedMaker: string
	permissionMic: PermissionStatus
	showMicPermissionModal: boolean
	isLoaded: boolean
	mountedCount: number
	isAptPriceChartOnSelectedDate: boolean
}
