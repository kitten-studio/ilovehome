import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
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

export type NoticeBoardTypeProps = {}

type NoticeBoardScreenProps = NativeStackScreenProps<AppStackParamList, "NoticeBoard"> & NoticeBoardTypeProps

const NoticeBoard: FC<NoticeBoardScreenProps> = ({ route, navigation }) => {
	const fetchDataLoading = {
		queryKey: ["service-info/notice/list"],
		url: "service-info/notice/list",
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
		let localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000) // utc + 9
		let dateFormat =
			localDate.getFullYear() +
			"-" +
			(localDate.getMonth() + 1 < 9 ? "0" + (localDate.getMonth() + 1) : localDate.getMonth() + 1) +
			"-" +
			(localDate.getDate() < 9 ? "0" + localDate.getDate() : localDate.getDate())
		return dateFormat
	}

	const renderItem = (item: NoticeInfoResponse) => {
		return (
			<>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.push("NoticeBoardDetail", {
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
			<Topbar title={"공지 사항"} isLeft />
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
						// paddingVertical: 10,
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

export default NoticeBoard
