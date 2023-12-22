import { AppStackParamList } from "@main/@types/params"
import { StackScreenProps } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
	ScrollView,
	StatusBar,
	View,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	AppState,
	Platform,
	Linking,
	BackHandler,
	Alert,
} from "react-native"
import Postcode from "@actbase/react-daum-postcode"
import { ViewDimension } from "../lib/ViewDimension"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { Color } from "../common/Color"
import AutoHeightImage from "react-native-auto-height-image"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"
import { DeviceInfos } from "../lib/DeviceInfo"
import { VersionInfoResponse } from "@main/@types/response"
import api from "../lib/api/api"
import _ from "lodash"

type AppUpdateModalProps = StackScreenProps<AppStackParamList, "AppUpdateModal">

const WIDTH = ViewDimension.get().width
const HEIGHT = ViewDimension.get().height

const splash_image = require("@main/static/app_permission/splash_image.png")

const AppUpdateModal: FC<AppUpdateModalProps> = ({ navigation, route }) => {
	const [appState, setAppState] = useState(AppState.currentState)
	const isShowModal = useRef<boolean>(false)

	useEffect(() => {
		const run = async () => {
			const { result } = await checkAppForceUpdate()
		}
		const handleAppStateChange = (nextAppState) => {
			if (appState.match(/inactive|background/) && nextAppState === "active") {
				// console.log("### App has come to the foreground!")
				run()
			}
			setAppState(nextAppState)
		}

		const listener = AppState.addEventListener("change", handleAppStateChange)
		return () => {
			listener.remove()
		}
	}, [appState])

	useEffect(() => {
		const run = async () => {
			const { result } = await checkAppForceUpdate()
		}
		run()
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#ffffff")
		})
		return unsubscribe
	}, [])

	const checkAppForceUpdate = async () => {
		const buildNumber = DeviceInfos.getBuildNumber()
		let result = false
		const { needshowOptionUpdate, forceUpdate } = await getCheckVersionInfo()
		if (Number(buildNumber) <= forceUpdate) {
			if (isShowModal.current) {
				return {
					result,
				}
			}
			// forceUpdate
			Alert.alert("최신 버전 업데이트", "최신버전 앱으로 업데이트를 위해\n스토어로 이동합니다.", [
				{
					text: "확인",
					onPress: () => {
						isShowModal.current = false
						openAppStore()
					},
				},
			])
			isShowModal.current = true
			result = true
		} else if (Number(buildNumber) <= needshowOptionUpdate) {
		}
		return {
			result,
		}
	}

	const openAppStore = () => {
		const storeLink = Platform.OS === "ios" ? "" : "market://details?id=com.ilovehomeapp"
		Linking.openURL(storeLink)
	}

	const getCheckVersionInfo = async () => {
		const fetchDataLoading = {
			queryKey: ["service-info/app/version/info"],
			url: "service-info/app/version/info",
			data: {},
		}
		const response = await api.post<VersionInfoResponse>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response?.status === 200) {
			return {
				needshowOptionUpdate: data?.needshowOptionUpdate ?? 0,
				forceUpdate: data?.forceUpdate ?? 0,
			}
		}
		return {
			needshowOptionUpdate: 0,
			forceUpdate: 0,
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<Image style={{ width: WIDTH, height: HEIGHT }} source={splash_image} />
		</View>
	)
}

export default AppUpdateModal
