import { ProductListResponse, PromotionInfoResponse } from "@main/@types/response"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { Alert, FlatList, Image, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import Topbar from "../components/Topbar"
import { useDataLoading, useDataLoadingWith } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"
import { StackScreenProps } from "@react-navigation/stack"
import AutoHeightImage from "react-native-auto-height-image"
import { loginStore } from "../lib/account/LoginStore"
import api from "../lib/api/api"

const defaultImage = require("@main/static/products/default_image.png")

const WIDTH = ViewDimension.get().width

type PromotionListType = StackScreenProps<AppStackParamList, "PromotionList"> & {
	userId: string
}

const PromotionList: FC<PromotionListType> = ({ navigation, route }) => {
	const [response, setResponse] = React.useState<PromotionInfoResponse[] | null>(null)

	const fetchDataLoading = {
		queryKey: ["product/promotion/list"],
		url: "product/promotion/list",
		data: {
			userId: route.params?.userId,
		},
	}
	const { data, isError, isLoading, refetch } = useDataLoadingWith<ProductListResponse[]>(fetchDataLoading)

	const getPromotionStatus = (goodsId: string): undefined | string => {
		const item = response?.find((item) => item.goods_id === goodsId)
		return item?.status
	}

	const getPromotionInfo = async () => {
		const userInfo = await loginStore.getUserInfo(true)
		if (!userInfo) return

		const fetchDataLoading = {
			queryKey: ["product/promotion/info"],
			url: "product/promotion/info",
			data: {
				userId: userInfo?.userId,
			},
		}
		const response = await api.post<PromotionInfoResponse[]>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response.status === 200) {
			setResponse(data)
		}
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#ffffff")
			StatusBar.setBarStyle("dark-content")
			refetch?.()
			getPromotionInfo()
			// console.log("### focus ")
		})
		return unsubscribe
	}, [])

	const getPrice = (price: number) => {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	const getImageThumbnail = (url: string) => {
		if (_.isEmpty(url)) return defaultImage
		return {
			uri: url,
		}
	}

	const getTitle = (title: string) => {
		return title?.length > 20 ? title.substring(0, 20) + "..." : title
	}

	const cancelPromotionItem = async (item: ProductListResponse) => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return

		const fetchDataLoading = {
			queryKey: ["product/promotion/delete"],
			url: "product/promotion/delete",
			data: {
				userId: userInfo?.userId,
				goods_id: item.goods_id,
			},
		}

		const response = await api.post<PromotionInfoResponse>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response.status === 200) {
			refetch?.()
		}
	}

	const renderProcessAlert = () => {
		Alert.alert("프로모션 승인중", "프로모션이 승인 중입니다. \n빠른 시일 내에 진행하겠습니다.")
	}

	const getPromotionStatusTitle = (goodsId: string) => {
		const status = getPromotionStatus(goodsId)
		if (status === "process") {
			return "승인 중"
		} else if (status === "done") {
			return "완료"
		} else if (status === "create") {
			return "사진 업로드"
		}
		return "승인 중"
	}

	const getPromotionStatusTitle2 = (goodsId: string) => {
		const status = getPromotionStatus(goodsId)
		if (status === "process") {
			return "수정 하기"
		} else if (status === "done") {
			return "완료"
		} else if (status === "create") {
			return "취소"
		}
	}

	const renderItem = (item: ProductListResponse) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => {
					const status = getPromotionStatus(item.goods_id)
					if (status !== "done") {
						navigation.push("ProductDetail3", {
							item: item,
						})
					}
				}}>
				<View
					style={{
						borderRadius: 10,
						backgroundColor: Color.white,
						marginVertical: 3,
						flexDirection: "row",
						height: 100,
						width: WIDTH - 20,
					}}>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 5,
						}}>
						<AutoHeightImage
							style={{ borderRadius: 5 }}
							source={item.main_product_image ? { uri: item.main_product_image } : defaultImage}
							width={80}
						/>
					</View>
					<View
						style={{
							flex: 1,
							alignItems: "flex-start",
							justifyContent: "center",
							paddingHorizontal: 5,
						}}>
						<Text style={{ fontStyle: "normal", color: Color.black, fontWeight: "500", paddingBottom: 5 }}>
							{getTitle(item.title)}
						</Text>
						<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
							<Text style={{ fontStyle: "normal", color: "#0033B7", fontWeight: "700" }}>{`${getPrice(item.price)} P`}</Text>
						</View>
					</View>
					<View style={{ justifyContent: "center" }}>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => {
								const status = getPromotionStatus(item.goods_id)
								if (status && status === "process") {
									renderProcessAlert()
								} else if (status && status === "done") {
									Alert.alert(
										"프로모션 완료",
										"프로모션이 승인이 완료 되었습니다.\n프로모션을 핸드폰으로 확인 부탁 드립니다."
									)
								} else {
									navigation.push("PhotoProductVerifier", {
										item: item,
									})
								}
							}}>
							<View
								style={{
									width: 100,
									height: 23,
									backgroundColor: "#0078BB",
									borderRadius: 2,
									marginRight: 5,
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Text
									style={{
										fontWeight: "500",
										fontSize: 13,
										color: Color.white,
									}}>
									{getPromotionStatusTitle(item.goods_id)}
								</Text>
							</View>
						</TouchableOpacity>
						{getPromotionStatus(item.goods_id) !== "done" && (
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => {
									const status = getPromotionStatus(item.goods_id)
									if (status && status === "process") {
										navigation.push("PhotoProductVerifier", {
											item: item,
											onClose: () => {
												// console.log("### onClose")
											},
										})
									} else {
										Alert.alert("프로모션 취소", "프로모션를 취소 하고 다시 진행 하시겠습니까?", [
											{
												text: "예",
												onPress: () => {
													cancelPromotionItem(item)
												},
											},
											{
												text: "아니요",
												onPress: () => {},
											},
										])
									}
								}}>
								<View
									style={{
										width: 100,
										height: 23,
										backgroundColor: "#B9B9B9",
										borderRadius: 2,
										marginRight: 5,
										marginTop: 10,
										justifyContent: "center",
										alignItems: "center",
									}}>
									<Text
										style={{
											fontWeight: "500",
											fontSize: 13,
											color: Color.white,
										}}>
										{getPromotionStatusTitle2(item.goods_id)}
									</Text>
								</View>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<>
			<Topbar title={"프로모션 답례품"} isLeft />
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
						backgroundColor: "#F3F3F3",
						paddingVertical: 10,
					}}>
					<FlatList
						data={data as ProductListResponse[]}
						initialNumToRender={15}
						keyExtractor={(item, index) => `${index}_${item.id}`}
						renderItem={({ item }) => renderItem(item)}
						contentInsetAdjustmentBehavior="automatic"
						showsVerticalScrollIndicator={false}
					/>
				</View>
			)}
		</>
	)
}

export default PromotionList
