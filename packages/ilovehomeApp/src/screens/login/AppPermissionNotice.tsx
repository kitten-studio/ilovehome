import { AppStackParamList } from "@main/@types/params"
import { StackScreenProps } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView, StatusBar, View, Image, StyleSheet, Text, TouchableOpacity, AppState } from "react-native"
import Postcode from "@actbase/react-daum-postcode"
import { ViewDimension } from "../lib/ViewDimension"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { Color } from "../common/Color"
import AutoHeightImage from "react-native-auto-height-image"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"

type AppPermissionNoticeProps = StackScreenProps<AppStackParamList, "AppPermissionNoticeModal">

const WIDTH = ViewDimension.get().width
const HEIGHT = ViewDimension.get().height

const splash_image = require("@main/static/app_permission/splash_image.png")
const AppPermissionNoticeModal_1 = require("@main/static/app_permission/AppPermissionNoticeModal_1.png")
const AppPermissionNoticeModal_2 = require("@main/static/app_permission/AppPermissionNoticeModal_2.png")

const AppPermissionNoticeModal: FC<AppPermissionNoticeProps> = ({ navigation, route }) => {
	const bottomSheetRef = useRef<BottomSheet>(null)
	const [appState, setAppState] = useState(AppState.currentState)
	const snapPoints = useMemo(() => ["60%"], [])

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
		bottomSheetRef.current?.expand()
	})

	useEffect(() => {
		const handleAppStateChange = (nextAppState) => {
			if (appState.match(/inactive|background/) && nextAppState === "active") {
				bottomSheetRef.current?.expand()
			}
			setAppState(nextAppState)
		}

		AppState.addEventListener("change", handleAppStateChange)
	}, [appState])

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0} // 이거 추가
				disappearsOnIndex={-1} // 이거 추가
			/>
		),
		[]
	)

	const handleSheetChanges = useCallback((index: number) => {}, [])

	const confirmButton = () => {
		navigation.goBack()
		StorageManager.getInstance().set<string>(Constants.APP_PERMISSION_NOTICE, "true")
	}

	return (
		<View style={{ flex: 1 }}>
			<Image style={{ width: WIDTH, height: HEIGHT }} source={splash_image} />
			<BottomSheet
				onClose={() => {
					confirmButton()
				}}
				ref={bottomSheetRef}
				enableOverDrag={true}
				enablePanDownToClose={true}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				onChange={handleSheetChanges}>
				<View style={styles.contentContainer}>
					<View style={{ height: 60, justifyContent: "center", alignItems: "center" }}>
						<Text style={{ fontSize: 20, color: Color.black }}>{" 서비스 이용을 위한\n              앱 접근권한 안내"}</Text>
					</View>
					<View style={{ height: 120, width: WIDTH, flexDirection: "row" }}>
						<View
							style={{
								marginLeft: 20,
								marginTop: 20,
							}}>
							<AutoHeightImage source={AppPermissionNoticeModal_1} width={180} />
						</View>
						<View style={{ flex: 1 }}></View>
					</View>
					<View
						style={{
							marginTop: 30,
							height: 80,
							width: WIDTH,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AutoHeightImage source={AppPermissionNoticeModal_2} width={257} />
					</View>
					<View style={{ flex: 1 }} />
					<TouchableOpacity activeOpacity={0.5} style={{}} onPress={confirmButton}>
						<View
							style={{
								width: WIDTH - 10,
								height: 43,
								backgroundColor: "#0078BB",
								borderRadius: 5,
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 10,
							}}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 15,
									color: Color.white,
								}}>
								{"확인"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</BottomSheet>
		</View>
	)
}

export default AppPermissionNoticeModal

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
})
