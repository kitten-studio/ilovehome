import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { NoticeInfoResponse } from "@main/@types/response"
import AutoHeightWebView from "react-native-autoheight-webview"
import { ViewDimension } from "../lib/ViewDimension"

const WIDTH = ViewDimension.get().width
export type NoticeBoardDetailTypeProps = {
	noticeInfo?: NoticeInfoResponse
}

type NoticeBoardDetailScreenProps = NativeStackScreenProps<AppStackParamList, "NoticeBoardDetail"> & NoticeBoardDetailTypeProps

const NoticeBoardDetailScreen: FC<NoticeBoardDetailScreenProps> = ({ route, navigation }) => {
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
			<Topbar title={route.params?.noticeInfo.title} isLeft />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
					justifyContent: "center",
					alignItems: "center",
				}}>
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

export default NoticeBoardDetailScreen
