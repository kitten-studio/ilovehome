import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { WebView } from "react-native-webview"

export type TermsAndPolicyTypeProps = {}

type TermsAndPolicyScreenProps = NativeStackScreenProps<AppStackParamList, "TermsAndPolicy"> & TermsAndPolicyTypeProps

const TermsAndPolicy: FC<TermsAndPolicyScreenProps> = ({ route, navigation }) => {
	const html_url = "https://ilovehome-s3-bucket.s3.ap-northeast-2.amazonaws.com/TermsAndPolicy/TermsAndPolicy.html"
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
			<Topbar title={"약관 및 정책"} isLeft />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				<WebView source={{ uri: html_url }} style={{ flex: 1 }} />
			</View>
		</>
	)
}

export default TermsAndPolicy
