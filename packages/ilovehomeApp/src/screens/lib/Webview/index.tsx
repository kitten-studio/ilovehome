import { AppStackParamList } from "@main/@types/params"
import Divider from "@main/screens/components/Divider"
import Topbar from "@main/screens/components/Topbar"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import { WebView } from "react-native-webview"

export type WebviewTypeProps = {
	title: string
	url: string
}

type WebviewScreenProps = NativeStackScreenProps<AppStackParamList, "Webview"> & WebviewTypeProps

const Webview: FC<WebviewScreenProps> = ({ route, navigation }) => {
	const { url, title } = route.params
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
			<Topbar title={title} isClose />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				<WebView source={{ uri: url }} style={{ flex: 1 }} />
			</View>
		</>
	)
}

export default Webview
