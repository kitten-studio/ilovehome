import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"

export type CurrentVersionTypeProps = {}

type CurrentVersionScreenProps = NativeStackScreenProps<AppStackParamList, "CurrentVersion"> & CurrentVersionTypeProps

const CurrentVersion: FC<CurrentVersionScreenProps> = ({ route, navigation }) => {
	const [userInfo, setUserInfo] = useState(route.params?.userInfo)
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#FFFFFF")
			StatusBar.setBarStyle("dark-content")
			const run = async () => {
				const userInfo = await loginStore.getUserInfo()
				if (!userInfo) return
				setUserInfo(userInfo)
			}
			run()
		})

		return unsubscribe
	}, [])

	const renderNotification = useCallback((title: string) => {
		return (
			<>
				<TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{}}>
					<View
						style={{
							height: 50,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<Text
							style={{
								fontWeight: "700",
								fontSize: 16,
								color: "black",
							}}>
							{title}
						</Text>
					</View>
				</TouchableOpacity>
				<Divider />
			</>
		)
	}, [])

	return (
		<>
			<Topbar title={"현재 버전"} isLeft />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}
			/>
		</>
	)
}

export default CurrentVersion
