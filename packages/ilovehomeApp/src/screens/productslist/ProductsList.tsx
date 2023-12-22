import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { Image, ImageSourcePropType, ScrollView, TouchableOpacity, View } from "react-native"
import { AppStackParamList } from "../../@types/params"
import Topbar from "../components/Topbar"
import { ViewDimension } from "../lib/ViewDimension"

const todayIsDiscoveryItem1 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem1.png")
const todayIsDiscoveryItem2 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem2.png")
const todayIsDiscoveryItem3 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem3.png")
const todayIsDiscoveryItem4 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem4.png")
const todayIsDiscoveryItem5 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem5.png")
const todayIsDiscoveryItem6 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem6.png")
const todayIsDiscoveryItem7 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem7.png")
const todayIsDiscoveryItem8 = require("@main/static/search_by_ranking/TodayIsDiscoveryItem5.png")

const WIDTH = ViewDimension.get().width

type ProductsListScreenProps = NativeStackScreenProps<AppStackParamList, "ProductsList">

const ProductsListScreen: FC<ProductsListScreenProps> = ({ navigation }) => {
	const [widthRate, setWidthRate] = useState(1)

	useEffect(() => {
		setWidthRate(WIDTH / 360)
	}, [])

	const renderProductsItem = useCallback(
		(image: ImageSourcePropType) => {
			return (
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.push("ProductDetail")
					}}>
					<Image source={image} style={{ width: 165 * widthRate, height: 286 * widthRate, resizeMode: "contain" }} />
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderProducts = () => {
		return (
			<>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 11,
						paddingTop: 11,
						width: WIDTH,
					}}>
					{renderProductsItem(todayIsDiscoveryItem7)}
					{renderProductsItem(todayIsDiscoveryItem8)}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 11,
						paddingTop: 11,
						width: WIDTH,
					}}>
					{renderProductsItem(todayIsDiscoveryItem5)}
					{renderProductsItem(todayIsDiscoveryItem6)}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 11,
						paddingTop: 11,
						width: WIDTH,
					}}>
					{renderProductsItem(todayIsDiscoveryItem4)}
					{renderProductsItem(todayIsDiscoveryItem3)}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 11,
						paddingTop: 11,
						paddingBottom: 11,
						width: WIDTH,
					}}>
					{renderProductsItem(todayIsDiscoveryItem1)}
					{renderProductsItem(todayIsDiscoveryItem2)}
				</View>
			</>
		)
	}

	return (
		<>
			<Topbar title={"답례품 리스트"} isLeft />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					backgroundColor: "#F3F3F3",
				}}>
				<ScrollView>{renderProducts()}</ScrollView>
			</View>
		</>
	)
}

export default ProductsListScreen
