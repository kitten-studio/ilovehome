import { AppStackParamList } from "@main/@types/params"
import { StackScreenProps } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import React, { FC, useEffect } from "react"
import { StatusBar, View, TouchableOpacity } from "react-native"
import { ViewDimension } from "@main/screens/lib/ViewDimension"
import AutoHeightImage from "react-native-auto-height-image"
import InAppBrowser from "@main/screens/lib/InAppBrowser"
import { StorageManager } from "@main/screens/lib/StorageManager"
import Constants from "@main/common/Constants"

const promotionNoticeImage01 = require("@main/static/home/PromotionNotice01.png")
const promotionNoticeImage02 = require("@main/static/home/PromotionNotice02.png")
const promotionNoticeImage03 = require("@main/static/home/PromotionNotice03.png")

export type PromotionNoticeProps = {}

type PromotionNoticeModalProps = StackScreenProps<AppStackParamList, "PromotionNoticeModal"> & PromotionNoticeProps

const WIDTH = ViewDimension.get().width

const PromotionNoticeModal: FC<PromotionNoticeModalProps> = ({ navigation, route }) => {
	useEffect(() => {
		StatusBar.setBackgroundColor("#F3F3F3")
	})

	return (
		<>
			<Topbar
				title={""}
				isClose
				color={"#F3F3F3"}
				onClose={() => {
					StorageManager.getInstance().set(Constants.LOCAL_USER_FIRST_NOTICE, "true")
					navigation.goBack()
				}}
			/>
			<View style={{ flex: 1, backgroundColor: "#F3F3F3", justifyContent: "center", alignItems: "center" }}>
				<View
					style={{
						marginBottom: 32,
						alignItems: "center",
						width: WIDTH,
					}}>
					<AutoHeightImage source={promotionNoticeImage01} width={WIDTH - 44} />
				</View>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						const url = "https://request.ilovehome.kr"
						InAppBrowser.openInAppBrowser(url, "프로모션 요청 방법")
						StorageManager.getInstance().set(Constants.LOCAL_USER_FIRST_NOTICE, "true")
						navigation.goBack()
					}}>
					<View
						style={{
							marginBottom: 32,
							paddingHorizontal: 11,
							alignItems: "center",
							width: WIDTH,
						}}>
						<AutoHeightImage source={promotionNoticeImage02} width={WIDTH - 122} />
					</View>
				</TouchableOpacity>
				<View
					style={{
						marginBottom: 32,
						alignItems: "center",
						width: WIDTH,
					}}>
					<AutoHeightImage source={promotionNoticeImage03} width={WIDTH - 44} />
				</View>
			</View>
		</>
	)
}

export default PromotionNoticeModal
