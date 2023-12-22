import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View, Image } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { NoticeInfoResponse } from "@main/@types/response"
import AutoHeightWebView from "react-native-autoheight-webview"
import { ViewDimension } from "../lib/ViewDimension"
import { Color } from "../common/Color"

const WIDTH = ViewDimension.get().width

const serviceqna_icon = require("@main/static/myinfo/serviceqna_icon.png")

export type ServiceQnADetailTypeProps = {
	noticeInfo?: NoticeInfoResponse
}

type ServiceQnADetailScreenProps = NativeStackScreenProps<AppStackParamList, "ServiceQnADetail"> & ServiceQnADetailTypeProps

const ServiceQnADetailScreen: FC<ServiceQnADetailScreenProps> = ({ route, navigation }) => {
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#FFFFFF")
			StatusBar.setBarStyle("dark-content")
		})

		return unsubscribe
	}, [])

	return (
		<>
			<Topbar title={"자주 묻는 질문 FAQ 상세"} isLeft />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<View
					style={{
						height: 75,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: Color.white,
						width: WIDTH,
					}}>
					<Image
						source={serviceqna_icon}
						style={{
							width: 25,
							height: 25,
							justifyContent: "center",
							alignItems: "center",
						}}
					/>
					<Text
						style={{
							fontWeight: "400",
							fontSize: 18,
							paddingLeft: 10,
							color: "black",
						}}>
						{route.params?.noticeInfo.title}
					</Text>
				</View>
				<AutoHeightWebView
					style={{ width: WIDTH - 22 }}
					automaticallyAdjustContentInsets={false}
					javaScriptEnabled
					files={[
						{
							href: "cssfileaddress",
							type: "text/css",
							rel: "stylesheet",
						},
					]}
					source={{
						html: route.params?.noticeInfo?.contents,
					}}
					viewportContent={"width=device-width, user-scalable=no"}
				/>
			</View>
		</>
	)
}

export default ServiceQnADetailScreen
