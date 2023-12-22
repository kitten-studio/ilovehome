import { DetailScreen } from "@main/@types/zustand/store/detailScreen"
import type { PermissionStatus } from "react-native-permissions"

export const initialState: DetailScreen = {
	showPyeong: false,
	areaDanjiId: 0,
	business: "",
	mktSource: "",
	isSsr: false,
	seedMaker: "",
	selectedSalesTypeIndex: 0,
	selectedRoomTypeIndex: 0,
	isLoaded: false,
	permissionMic: "unavailable" as PermissionStatus,
	showMicPermissionModal: false,
	mountedCount: 0,
	isAptPriceChartOnSelectedDate: false,
}
