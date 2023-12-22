import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, StatusBar, Text, TouchableOpacity, View, Image } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { useDataLoadingWith } from "../hooks/useDataLoading"
import { NoticeInfoResponse } from "@main/@types/response"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import { Color } from "../common/Color"
import { ViewDimension } from "../lib/ViewDimension"
import Icon from "react-native-vector-icons/AntDesign"

const WIDTH = ViewDimension.get().width
const serviceqna_icon = require("@main/static/myinfo/serviceqna_icon.png")

export type ServiceQnATypeProps = {}

type ServiceQnAScreenProps = NativeStackScreenProps<AppStackParamList, "ServiceQnA"> & ServiceQnATypeProps

const ServiceQnA: FC<ServiceQnAScreenProps> = ({ route, navigation }) => {
	const fetchDataLoading = {
		queryKey: ["service-info/qna/list"],
		url: "service-info/qna/list",
		data: {},
	}
	const { data, isError, isLoading } = useDataLoadingWith<NoticeInfoResponse[]>(fetchDataLoading)
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

	function dateFormat(date: Date) {
		let dateFormat =
			date.getFullYear() +
			"-" +
			(date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
			"-" +
			(date.getDate() < 9 ? "0" + date.getDate() : date.getDate())
		return dateFormat
	}

	const renderItem = (item: NoticeInfoResponse) => {
		return (
			<>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.push("ServiceQnADetail", {
							noticeInfo: item,
						})
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
						<View style={{ paddingLeft: 10 }}>
							<Image
								source={serviceqna_icon}
								style={{
									width: 30,
									height: 30,

									justifyContent: "center",
									alignItems: "center",
								}}
							/>
						</View>

						<View style={{}}>
							<Text
								style={{
									fontWeight: "400",
									fontSize: 15,
									paddingLeft: 10,
									color: "black",
								}}>
								{item.title}
							</Text>
							<Text
								style={{
									fontWeight: "400",
									fontSize: 12,
									paddingLeft: 10,
									paddingTop: 10,
									color: "black",
								}}>
								{dateFormat(new Date(item.createdAt))}
							</Text>
						</View>

						<View style={{ flex: 1 }} />
						<View style={{ paddingRight: 10 }}>
							<Icon name="right" color={"#000000"} size={17} />
						</View>
					</View>
				</TouchableOpacity>

				<Divider />
			</>
		)
	}

	return (
		<>
			<Topbar title={"자주 묻는 질문 FAQ"} isLeft />
			<Divider />
			{isLoading && <LoadingView />}
			{isError && <NetworkError />}
			{data?.length === 0 && (
				<View
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#F3F3F3",
					}}>
					<Text>List is Empty</Text>
				</View>
			)}
			{data?.length !== 0 && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						backgroundColor: Color.white,
						width: "100%",
					}}>
					<FlatList
						data={data as NoticeInfoResponse[]}
						initialNumToRender={15}
						keyExtractor={(item, index) => `${index}_${item.title}`}
						renderItem={({ item }) => renderItem(item)}
						contentInsetAdjustmentBehavior="automatic"
						showsVerticalScrollIndicator={false}
					/>
				</View>
			)}
		</>
	)
}

export default ServiceQnA
