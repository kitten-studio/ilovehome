import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"

export type SupportCenterTypeProps = {
	userInfo: UserInfo
}

type SupportCenterScreenProps = NativeStackScreenProps<AppStackParamList, "SupportCenter"> & SupportCenterTypeProps

const SupportCenter: FC<SupportCenterScreenProps> = ({ route, navigation }) => {
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#FFFFFF")
			StatusBar.setBarStyle("dark-content")
		})

		return unsubscribe
	}, [])

	const renderCallCustomerSupport = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 10,
							color: "black",
						}}>
						{"상담원 전화 문의"}
					</Text>
					<View style={{ flex: 1 }} />
					<View style={{ paddingRight: 10 }}>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingLeft: 10,
								color: "black",
							}}>
							{"1877-4227"}
						</Text>
					</View>
				</View>
				<Divider />
			</>
		)
	}, [])

	const renderEmailCustomerSupport = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 10,
							color: "black",
							justifyContent: "flex-start",
							alignItems: "flex-start",
						}}>
						{"이메일 문의"}
					</Text>
					<View style={{ flex: 1 }} />
					<View style={{ paddingRight: 10 }}>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingLeft: 10,
								color: "black",
							}}>
							{"jayce@ilovehome.kr"}
						</Text>
					</View>
				</View>
				<Divider />
			</>
		)
	}, [])

	const renderContactCustomerSupportKakaotalk = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#FFE247",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 10,
							color: "black",
						}}>
						{"카카오톡 1:1 문의"}
					</Text>
					<View style={{ flex: 1 }} />
					<View style={{ paddingRight: 10 }}>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingLeft: 10,
								color: "black",
							}}>
							{"gohyangplus"}
						</Text>
					</View>
				</View>
				<Divider />
			</>
		)
	}, [])

	return (
		<>
			<Topbar title={"고객센터"} isLeft />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				{renderContactCustomerSupportKakaotalk()}
				{renderCallCustomerSupport()}
				{renderEmailCustomerSupport()}
			</View>
		</>
	)
}

export default SupportCenter
