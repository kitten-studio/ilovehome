import { AppStackParamList } from "@main/@types/params"
import { ProductListResponse } from "@main/@types/response"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { Color } from "../common/Color"
import { countDigits, numberWithCommas } from "../common/StringUtils"
import { useDataLoading } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"

const mainPromotionImage = require("@main/static/home/main_promotion.jpg")
const WIDTH = ViewDimension.get().width
const defaultImage = require("@main/static/products/default_image.png")

type CardBannerProps = {}

export const CardBanner: FC<CardBannerProps> = () => {
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
	const [item, setItem] = useState<ProductListResponse>()

	const fetchDataLoading = {
		queryKey: ["recommend/main/promotion/list"],
		url: "recommend/main/promotion/list",
		data: {
			title: "jeldino@gmail.com",
		},
	}
	const { data, isError, isLoading, error } = useDataLoading(fetchDataLoading)

	useEffect(() => {
		if (data) {
			setItem(data[0])
		}
	}, [data])

	const getPrice = (price: number | undefined) => {
		if (price === undefined) return ""
		return price!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			style={{
				flex: 1,
				paddingVertical: 10,
				justifyContent: "center",
				alignItems: "center",
			}}
			onPress={() => {
				if (_.isEmpty(item)) return

				navigation.push("ProductDetail3", {
					item: item!,
					fromPromotion: true,
				})
			}}>
			<Image
				source={item?.main_product_image ? { uri: item?.main_product_image } : defaultImage}
				style={{
					width: 327,
					height: 200,
					borderRadius: 5,
				}}
			/>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontStyle: "normal",
						color: Color.black,
						fontWeight: "500",
						paddingBottom: 10,
						paddingTop: 10,
						paddingHorizontal: 20,
						fontSize: 15,
					}}>
					{item?.title}
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					width: 327,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Text
					style={{
						fontStyle: "normal",
						color: "#0033B7",
						fontWeight: "500",
						marginTop: 30,
						marginLeft: 10,
						paddingBottom: 10,
						fontSize: 15,
					}}>
					{item?.prefectureName}
				</Text>
				{item && (
					<View style={{ width: 90 }}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.black,
								fontWeight: "700",
								paddingBottom: 10,
								fontSize: 15,
							}}>
							{`${numberWithCommas(countDigits((item.price * 10) / 3))} 원`}
						</Text>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.black,
								fontWeight: "700",
								paddingLeft: 10,
								paddingBottom: 10,
								fontSize: 15,
							}}>
							{`${getPrice(item.price)} P`}
						</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}
