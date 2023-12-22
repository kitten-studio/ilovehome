import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React, { FC, useCallback, useEffect, useState } from "react"
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native"

import _ from "lodash"
import Icon from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import { AppStackParamList, AppStackScreenProps, IndexTabParamList } from "../../@types/params"
import { Color } from "../common/Color"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { ViewDimension } from "../lib/ViewDimension"
import { DeviceInfos } from "../lib/DeviceInfo"
import { ScrollView } from "react-native-gesture-handler"

export type MyInfoTabScreenProps<T extends keyof IndexTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<IndexTabParamList, T>,
	AppStackScreenProps<keyof AppStackParamList>
>

const MyInfoIcons = {
	NoticeBoard: require("@main/static/myinfo/icons/free-icon-annoucement.png"),
	SupportCenter: require("@main/static/myinfo/icons/free-icon-operator.png"),
	TermsAndPolicy: require("@main/static/myinfo/icons/free-icon-document.png"),
	CurrentVersion: require("@main/static/myinfo/icons/free-icon-letter-v.png"),
	GuideToHometownLoveDonation: require("@main/static/myinfo/icons/free-icon-terms-of-use.png"),
}
const MyInfoIconsSize = {
	NoticeBoard: 36,
	SupportCenter: 23,
	TermsAndPolicy: 23,
	CurrentVersion: 23,
	GuideToHometownLoveDonation: 23,
}

const MyInfoItems = {
	FavoriteListImg: require("@main/static/myinfo/FavoriteList.png"),
	OrderHistoryImg: require("@main/static/myinfo/OrderHistory.png"),
	PointManagementImg: require("@main/static/myinfo/PointManagement.png"),
	ReviewManagementImg: require("@main/static/myinfo/ReviewManagement.png"),
	RecentlyViewItemImg: require("@main/static/myinfo/RecentlyViewItem.png"),
	NotificationImg: require("@main/static/myinfo/Notification.png"),
	FrequentlyAskedQuestionsImg: require("@main/static/myinfo/FrequentlyAskedQuestions-v2.png"), // v2
	PromotionListImg: require("@main/static/myinfo/PromotionListImg-v2.png"), // v2
	PromotionRequestListImg: require("@main/static/myinfo/PromotionRequestListImg-v2.png"), // v2
	SendEmailInquiryImg: require("@main/static/myinfo/SendEmailInquiry.png"),
}
type MyInfoItemsType =
	| "FavoriteListImg"
	| "OrderHistoryImg"
	| "PointManagementImg"
	| "ReviewManagementImg"
	| "RecentlyViewItemImg"
	| "NotificationImg"
	| "FrequentlyAskedQuestionsImg"
	| "PromotionListImg"
	| "PromotionRequestListImg"
	| "SendEmailInquiryImg"

type NotificationType = "NoticeBoard" | "SupportCenter" | "TermsAndPolicy" | "CurrentVersion" | "GuideToHometownLoveDonation"
const WIDTH = ViewDimension.get().width

const MyInfoTabScreen: FC<MyInfoTabScreenProps<"MyInfo">> = ({ navigation }) => {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const [widthRate, setWidthRate] = useState(1)
	const [version, setVersion] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			const isLogin = await loginStore.isLoggedIn()
			const userInfo = await loginStore.getUserInfo(true)
			setUserInfo(userInfo)
			setWidthRate(WIDTH / 360)
		}

		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#009abc")
			StatusBar.setBarStyle("dark-content")
			const Dev = process.env.STAGE === "real" ? "R" : process.env.STAGE === "preview" ? "P" : "D"
			setVersion(`${DeviceInfos.getVersion()} (${DeviceInfos.getBuildNumber()}${Dev})`)
			run()
		})

		return unsubscribe
	}, [])

	const renderMyInfoItem = useCallback(
		(itemType: MyInfoItemsType) => {
			return (
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={async () => {
						const userInfo = await loginStore.getUserInfo(true)
						if (itemType === "PromotionRequestListImg") {
							if (userInfo !== null) {
								navigation.push("PromotionRequestList", { userId: userInfo.userId })
							} else {
								navigation.push("ProviderLoginModal", { isRegister: false })
							}
						} else if (itemType === "PromotionListImg") {
							if (!(await loginStore.isLoggedIn())) {
								navigation.push("ProviderLoginModal", { isRegister: true })
								return
							} else {
								const userInfo = await loginStore.getUserInfo(true)
								if (!_.isEmpty(userInfo)) {
									if (!userInfo?.isRegistered) {
										navigation.push("UserRegisterModal")
										return
									}
								}
							}
							if (userInfo !== null) {
								navigation.push("PromotionList", { userId: userInfo.userId })
							} else {
								navigation.push("ProviderLoginModal", { isRegister: false })
							}
						} else if (itemType === "FrequentlyAskedQuestionsImg") {
							navigation.push("ServiceQnA")
						} else if (itemType === "SendEmailInquiryImg") {
							navigation.push("EmailInquiry")
						}
					}}
					style={{ paddingHorizontal: 5 }}>
					<Image source={MyInfoItems[itemType]} style={{ width: 108 * widthRate, height: 125 * widthRate }} />
				</TouchableOpacity>
			)
		},
		[MyInfoItems]
	)

	const renderMyInfoNotification = useCallback(
		(itemType: MyInfoItemsType) => {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{ paddingHorizontal: 5 }}>
					<Image source={MyInfoItems[itemType]} style={{ width: 167, height: 39 }} />
				</TouchableOpacity>
			)
		},
		[MyInfoItems]
	)

	const renderMyInfoRecentlyViewItem = useCallback(
		(itemType: MyInfoItemsType) => {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{ paddingHorizontal: 5 }}>
					<Image source={MyInfoItems[itemType]} style={{ width: 167, height: 39 }} />
				</TouchableOpacity>
			)
		},
		[MyInfoItems]
	)

	const renderAppVersion = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 60,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						paddingLeft: 15,
					}}>
					{MyInfoIconsSize["CurrentVersion"] === 23 && (
						<Image
							source={MyInfoIcons["CurrentVersion"]}
							style={{
								width: MyInfoIconsSize["CurrentVersion"],
								height: MyInfoIconsSize["CurrentVersion"],
							}}
						/>
					)}
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 5,
							color: "black",
						}}>
						{"앱 버전"}
					</Text>
					<View style={{ flex: 1 }} />
					<View style={{ paddingRight: 30 }}>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingLeft: 30,
								color: "black",
							}}>
							{version}
						</Text>
					</View>
				</View>
				<Divider />
			</>
		)
	}, [version])

	const renderNotification = useCallback(
		(title: string, type: NotificationType) => {
			return (
				<>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => {
							if (type === "GuideToHometownLoveDonation") {
								navigation.push("IntroductionGuide")
							} else {
								navigation.push(type)
							}
						}}
						style={{ paddingHorizontal: 0, paddingVertical: 5 }}>
						<View
							style={{
								height: 50,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								paddingLeft: 15,
							}}>
							{MyInfoIconsSize[type] === 36 && (
								<View style={{ marginLeft: -7 }}>
									<Image
										source={MyInfoIcons[type]}
										style={{ width: MyInfoIconsSize[type], height: MyInfoIconsSize[type] }}
									/>
								</View>
							)}
							{MyInfoIconsSize[type] === 23 && (
								<Image source={MyInfoIcons[type]} style={{ width: MyInfoIconsSize[type], height: MyInfoIconsSize[type] }} />
							)}

							<Text
								style={{
									fontWeight: "500",
									fontSize: 16,
									paddingLeft: 5,
									color: "black",
								}}>
								{title}
							</Text>
							<View style={{ flex: 1 }} />
							<View style={{ paddingRight: 30 }}>
								<Icon name="right" color={"#000000"} size={17} />
							</View>
						</View>
					</TouchableOpacity>
					<Divider />
				</>
			)
		},
		[MyInfoItems]
	)

	const registerButton = async () => {
		if (!(await loginStore.isLoggedIn())) {
			navigation.push("ProviderLoginModal", { isRegister: true })
		} else {
			const userInfo = await loginStore.getUserInfo(true)
			if (!_.isEmpty(userInfo)) {
				if (!userInfo?.isRegistered) {
					navigation.push("UserRegisterModal")
				}
			}
		}
	}

	return (
		<>
			<Topbar title={"내정보"} color={"#009abc"} />
			<Divider />

			<View
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				<View style={{ height: 70, alignItems: "center", justifyContent: "center" }}>
					{!userInfo?.isRegistered && (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => {
								registerButton()
							}}
							style={{ paddingHorizontal: 5 }}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Ionicons name="ios-person-circle-sharp" color={"#083BF0"} size={25} />
								<Text
									style={{
										fontWeight: "700",
										color: "#083BF0",
										fontSize: 16,
										paddingRight: 5,
										paddingLeft: 5,
									}}>
									{`로그인 및 회원등록 하기`}
								</Text>
								<Icon name="right" color={"#083BF0"} size={17} />
							</View>
						</TouchableOpacity>
					)}
					{userInfo?.isRegistered && (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => {
								navigation.push("MyInfoManager", { userInfo })
							}}
							style={{ paddingHorizontal: 5 }}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									flex: 1,
								}}>
								<Ionicons name="ios-person-circle-sharp" color={"#083BF0"} size={35} />
								<View style={{ width: 150 }}>
									<Text
										style={{
											fontWeight: "700",
											color: Color.black,
											fontSize: 16,
											paddingRight: 5,
											paddingLeft: 5,
										}}>
										{userInfo?.name}
									</Text>
									<Text
										style={{
											fontWeight: "500",
											color: Color.black,
											fontSize: 15,
											paddingRight: 5,
											paddingLeft: 5,
										}}>
										{`내정보 관리 >`}
									</Text>
								</View>
								<View style={{ width: 150, height: 70 }}></View>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<Divider />
				<View
					style={{
						// height: 100,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						paddingTop: 10,
						paddingBottom: 10,
					}}>
					{renderMyInfoItem("PromotionListImg")}
					{renderMyInfoItem("PromotionRequestListImg")}
					{renderMyInfoItem("FrequentlyAskedQuestionsImg")}
				</View>
				<Divider />
				{renderNotification("공지사항", "NoticeBoard")}
				{renderNotification("고객센터", "SupportCenter")}
				{renderNotification("고향사랑기부제 안내", "GuideToHometownLoveDonation")}
				{renderNotification("약관 및 정책", "TermsAndPolicy")}
				{renderAppVersion()}
			</View>
		</>
	)
}

export default MyInfoTabScreen
