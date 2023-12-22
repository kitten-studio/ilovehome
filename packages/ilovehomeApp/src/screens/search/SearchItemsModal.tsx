import { ProductListResponse } from "@main/@types/response"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import _ from "lodash"
import React, { FC, createRef, useEffect, useRef, useState } from "react"
import { FlatList, Image, Keyboard, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import Topbar from "../components/Topbar"
import { useDataLoading, useDataLoadingWith } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"
import { StackScreenProps } from "@react-navigation/stack"
import AutoHeightImage from "react-native-auto-height-image"
import TopbarWithSearch from "../components/TopbarWithSearch"
import axios from "axios"

const defaultImage = require("@main/static/products/default_image.png")

const WIDTH = ViewDimension.get().width

type SearchItemsScreenType = StackScreenProps<AppStackParamList, "SearchItems"> & {}

const SearchItemsScreen: FC<SearchItemsScreenType> = ({ navigation, route }) => {
	const [data, setData] = useState<ProductListResponse[] | null>(null)
	const keywords = useRef<string>("")
	const search = async () => {
		const response = await axios.post(`${process.env.API_HOST}/product/search`, {
			keywords: keywords.current,
		})
		setData(response.data)
	}

	const onChangeText = (text: string) => {
		keywords.current = text
	}

	useEffect(() => {
		const subscriptions = [
			Keyboard.addListener("keyboardDidShow", () => {}),
			Keyboard.addListener("keyboardDidHide", () => {
				search()
			}),
		]
		return () => {
			subscriptions.forEach((s) => {
				s.remove()
			})
		}
	}, [])

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#ffffff")
			StatusBar.setBarStyle("dark-content")
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
		return title?.length > 30 ? title.substring(0, 30) + "..." : title
	}

	const renderItem = (item: ProductListResponse) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => {
					navigation.push("ProductDetail3", {
						item: item,
					})
				}}>
				<View
					style={{
						borderRadius: 10,
						backgroundColor: Color.white,
						marginVertical: 3,
						flexDirection: "row",
						height: 120,
						width: WIDTH - 20,
					}}>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 12,
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
							paddingHorizontal: 12,
						}}>
						<Text style={{ fontStyle: "normal", color: Color.black, fontWeight: "500", paddingBottom: 5 }}>
							{getTitle(item.title)}
						</Text>
						<Text style={{ fontStyle: "normal", color: "#0033B7", fontWeight: "700" }}>{`${getPrice(item.price)} P`}</Text>
						<Text
							style={{
								fontStyle: "normal",
								color: "#0033B7",
								paddingTop: 2,
							}}>{`${item.request_promotion_max}명 까지 ${item.request_promotion_count}명 유저가 요청 중`}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<>
			<TopbarWithSearch isClose onChangeText={onChangeText} />
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

export default SearchItemsScreen
