import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React, { FC, useCallback, useEffect, useState } from "react"
import { View, Image, Text, TouchableOpacity, StatusBar, FlatList } from "react-native"
import { IndexTabParamList, AppStackScreenProps, AppStackParamList } from "../../@types/params"
import Topbar from "../components/Topbar"
import { ViewDimension } from "../lib/ViewDimension"
import AutoHeightImage from "react-native-auto-height-image"
import { ProductListResponse } from "@main/@types/response"
import { Color } from "../common/Color"
import InAppBrowser from "../lib/InAppBrowser"

import { RFValue } from "react-native-responsive-fontsize"
import { Product, sourceData } from "./ContributorList"
import api from "../lib/api/api"
import _ from "lodash"

export type ContributorTabScreenProps<T extends keyof IndexTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<IndexTabParamList, T>,
	AppStackScreenProps<keyof AppStackParamList>
>

const defaultImage = require("@main/static/products/default_image.png")
const contributorListBlogItem = require("@main/static/contributor/ContributorListBlog.png")

const WIDTH = ViewDimension.get().width
const HEIHGT = ViewDimension.get().height

const ContributorListScreen: FC<ContributorTabScreenProps<"Contributors">> = ({ navigation }) => {
	const [widthRate, setWidthRate] = useState(1)
	const [data, setData] = useState<Product[]>([])
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#009abc")
			StatusBar.setBarStyle("dark-content")
		})
		setData(sourceData)
		return unsubscribe
	}, [])

	const renderGoToGuide = useCallback(() => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingTop: 11,
					paddingBottom: 11,
					paddingHorizontal: 11,
					justifyContent: "center",
					alignItems: "center",
					width: WIDTH,
				}}
				onPress={() => {
					const external_url = "https://blog.naver.com/gohyangplus/223216682373"
					InAppBrowser.openInAppBrowser(external_url, "기부후기")
				}}>
				<AutoHeightImage source={contributorListBlogItem} width={WIDTH - 22} />
			</TouchableOpacity>
		)
	}, [widthRate])

	const getTitle = (title: string) => {
		return title?.length > 20 ? title.substring(0, 20) + "..." : title
	}
	const getPrefectureName = (title: string) => {
		return title?.length > 10 ? title.substring(0, 10) + "..." : title
	}

	const getItemInfo = async (goods_id: string) => {
		const fetchDataLoading = {
			queryKey: ["product/items"],
			url: "product/items",
			data: {
				goods_id: goods_id,
				filter_type: "once_item",
			},
		}
		const response = await api.post<ProductListResponse[]>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response.status === 200) {
			const item = data?.find((item) => item.goods_id === goods_id)
			if (item) {
				return item
			}
		}
		return undefined
	}

	const renderItem = (item: Product) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={async () => {
					const itemInfo = await getItemInfo(item.goods_id)
					if (itemInfo) {
						navigation.push("ProductDetail3", {
							item: itemInfo,
							fromPromotion: true,
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
							paddingHorizontal: 10,
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
						<Text
							style={{
								fontStyle: "normal",
								fontSize: RFValue(11),
								color: Color.black,
								fontWeight: "600",
								paddingBottom: 10,
							}}>
							{getTitle(item.title)}
						</Text>
						<Text
							style={{
								fontStyle: "normal",
								fontSize: RFValue(11),
								color: Color.black,
								fontWeight: "600",
								paddingBottom: 10,
							}}>
							{getPrefectureName(item.prefectureName)}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							alignItems: "flex-end",
							justifyContent: "center",
							paddingHorizontal: 5,
						}}>
						<Text style={{ fontStyle: "normal", color: Color.black, fontWeight: "700", paddingBottom: 10 }}>{""}</Text>
						<Text
							style={{
								fontStyle: "normal",
								fontSize: 11,
								color: Color.black,
								fontWeight: "500",
								paddingBottom: 10,
							}}>
							{`기부자 ${item.user_name}`}
						</Text>
						<Text
							style={{
								fontStyle: "normal",
								fontSize: 11,
								color: Color.black,
								fontWeight: "500",
								paddingBottom: 10,
							}}>
							{`배송일: ${item.delivery_date}`}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<>
			<Topbar title={"기부자 리스트"} color={"#009abc"} />
			{renderGoToGuide()}
			<View
				style={{
					flex: 1,
					alignItems: "center",
					backgroundColor: "#F3F3F3",
					paddingVertical: 5,
				}}>
				<FlatList
					data={data as Product[]}
					initialNumToRender={15}
					keyExtractor={(item, index) => `${index}_${item.id}`}
					renderItem={({ item }) => renderItem(item)}
					contentInsetAdjustmentBehavior="automatic"
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</>
	)
}

export default ContributorListScreen
