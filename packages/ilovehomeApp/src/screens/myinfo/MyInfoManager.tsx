import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { ViewDimension } from "../lib/ViewDimension"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Color } from "../common/Color"
import Icon from "react-native-vector-icons/AntDesign"

const WIDTH = ViewDimension.get().width

export type MyInfoManagerTypeProps = {
	userInfo: UserInfo
}

type MyInfoManagerScreenProps = NativeStackScreenProps<AppStackParamList, "MyInfoManager"> & MyInfoManagerTypeProps

const MyInfoManager: FC<MyInfoManagerScreenProps> = ({ route, navigation }) => {
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

	const renderMyInfoDetail = (title: string, detail: string) => {
		return (
			<>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.push("UserRegisterModal", { userInfo })
					}}
					style={{ paddingHorizontal: 5 }}>
					<View style={{ height: 52, width: "100%", flexDirection: "row" }}>
						<View
							style={{
								height: 52,
								width: 100,
								justifyContent: "center",
								alignItems: "flex-start",
							}}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 16,
									paddingLeft: 10,
									color: "black",
								}}>
								{title}
							</Text>
						</View>
						<View
							style={{
								height: 52,
								flex: 1,
								justifyContent: "center",
								alignItems: "flex-end",
							}}>
							<Text
								style={{
									fontWeight: "300",
									fontSize: 16,
									paddingRight: 10,
									color: "black",
								}}>
								{detail}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
				<Divider />
			</>
		)
	}

	const showToast = (text: string) => {
		Toast.show({
			type: "success",
			text1: text,
			position: "bottom",
			visibilityTime: 3000,
		})
	}

	const renderTitle = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					height: 70,
					paddingLeft: 10,
					marginVertical: 20,
				}}>
				<Ionicons name="ios-person-circle-sharp" color={"#083BF0"} size={55} />
				<View style={{ width: 150 }}>
					<Text
						style={{
							fontWeight: "700",
							color: Color.black,
							fontSize: 20,
							paddingRight: 5,
							paddingLeft: 5,
						}}>
						{userInfo?.name}
					</Text>
				</View>
				<View style={{ width: 150, height: 70, justifyContent: "center", alignItems: "flex-end" }}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => {
							showToast("로그 아웃을 하였습니다.")
							loginStore.clearAuthentication()
							navigation?.dispatch(
								CommonActions.reset({
									index: 0,
									routes: [{ name: "Index" }],
								})
							)
						}}
						style={{ paddingHorizontal: 5 }}>
						<View
							style={{
								paddingRight: 15,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "flex-end",
							}}>
							<Text
								style={{
									fontWeight: "500",
									color: "#3483F9",
									fontSize: 15,
									paddingRight: 5,
									paddingLeft: 5,
								}}>
								{"로그아웃"}
							</Text>
							<View style={{ paddingBottom: 1 }}>
								<Icon name="right" color={"#3483F9"} size={17} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<>
			<Topbar title={"내정보 관리"} isClose />
			<Divider />
			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				{renderTitle()}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 30,
						paddingLeft: 20,
						marginVertical: 20,
					}}>
					<Text
						style={{
							fontWeight: "500",
							color: Color.black,
							fontSize: 15,
							paddingRight: 5,
							paddingLeft: 5,
						}}>
						{"회원정보"}
					</Text>
				</View>
				<Divider />
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 25,
						paddingLeft: 20,
						marginVertical: 10,
					}}>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: "#7E7E7E",
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{"고객명"}
						</Text>
					</View>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: Color.black,
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{userInfo?.name}
						</Text>
					</View>
					<View
						style={{
							width: 150,
							height: 25,
							justifyContent: "center",
							alignItems: "flex-end",
						}}>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => {
								navigation.push("UserRegisterModal", { userInfo })
							}}
							style={{ paddingHorizontal: 5 }}>
							<View
								style={{
									paddingRight: 15,
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "flex-end",
								}}>
								<Text
									style={{
										fontWeight: "500",
										color: "#3483F9",
										fontSize: 15,
										paddingRight: 5,
										paddingLeft: 5,
									}}>
									{"회원정보수정"}
								</Text>
								<View style={{ paddingBottom: 1 }}>
									<Icon name="right" color={"#3483F9"} size={17} />
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 25,
						paddingLeft: 20,
						marginVertical: 10,
					}}>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: "#7E7E7E",
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{"이메일"}
						</Text>
					</View>
					<View style={{ width: WIDTH - 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: Color.black,
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{userInfo?.email}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 25,
						paddingLeft: 20,
						marginVertical: 10,
					}}>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: "#7E7E7E",
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{"휴대폰"}
						</Text>
					</View>
					<View style={{ width: WIDTH - 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: Color.black,
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{userInfo?.phoneNumber}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 25,
						paddingLeft: 20,
						marginVertical: 10,
						marginBottom: 10,
					}}>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: "#7E7E7E",
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{"주소"}
						</Text>
					</View>
					<View
						style={{
							width: WIDTH - 130,
							height: 50,
							justifyContent: "center",
							marginRight: 10,
						}}>
						<Text
							style={{
								fontWeight: "500",
								color: Color.black,
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{userInfo?.address + " " + userInfo?.addressDetail}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 25,
						paddingLeft: 20,
						marginVertical: 10,
						marginBottom: 10,
					}}>
					<View style={{ width: 100 }}>
						<Text
							style={{
								fontWeight: "500",
								color: "#7E7E7E",
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{"추천코드"}
						</Text>
					</View>
					<View
						style={{
							width: WIDTH - 130,
							height: 50,
							justifyContent: "center",
							marginRight: 10,
						}}>
						<Text
							style={{
								fontWeight: "500",
								color: Color.black,
								fontSize: 15,
								paddingRight: 5,
								paddingLeft: 5,
							}}>
							{userInfo?.referralCode}
						</Text>
					</View>
				</View>
				<View style={{ height: 10 }} />
				<Divider />
			</View>
		</>
	)
}

export default MyInfoManager
