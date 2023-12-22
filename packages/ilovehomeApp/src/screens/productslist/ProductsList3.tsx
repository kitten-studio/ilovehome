import { ProductListRenderItem, ProductListResponse } from "@main/@types/response"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import _ from "lodash"
import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import Divider from "../components/Divider"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import Topbar from "../components/Topbar"
import { useDataLoading } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"
import { useStore } from "../lib/Zustand"
import { Tab } from "../lib/uix/components/Tab"
import { getPrefectureidFromItemName } from "./ProductsListUtils"

const defaultImage = require("@main/static/products/default_image.png")
const promotion_img = require("@main/static/products/promotion_img.png")
const normal_img = require("@main/static/products/normal_img.png")
const promotion_mark = require("@main/static/products/promotion_mark.png")
const question_mark = require("@main/static/products/question_mark.png")
const starbucks_coupon = require("@main/static/products/starbucks_coupon.png")
const cu_coupon = require("@main/static/products/cu_coupon.png")
const request_coupon = require("@main/static/products/request_coupon.png")

const pointTypeTitles = [
	{ text: "전체" },
	{ text: "1000P" },
	{ text: "3000P" },
	{ text: "5000P" },
	{ text: "10,000P" },
	{ text: "15,000P" },
	{ text: "20,000P" },
	{ text: "25,000P" },
	{ text: "30,000P" },
]
const categoryTypeTitles = [
	{ text: "전체" },
	{ text: "농산물" },
	{ text: "수산물" },
	{ text: "축산물" },
	{ text: "가공식품" },
	{ text: "생활용품" },
	{ text: "지역상품권" },
	{ text: "지역상품권" },
	{ text: "기타상품" },
]

const WIDTH = ViewDimension.get().width

type ProductsListScreenProps = NativeStackScreenProps<AppStackParamList, "ProductsList">

const ProductsListScreen3: FC<ProductsListScreenProps> = ({ navigation, route }) => {
	const [widthRate, setWidthRate] = useState(1)
	const { type, itemName } = route.params

	const fetchDataLoading = {
		queryKey: ["product/list"],
		url: "product/list",
		data: {
			title: "jeldino@gmail.com",
			description: "1234",
			price: 51,
			type: type,
			itemName: itemName,
			prefectureid: getPrefectureidFromItemName(itemName),
		},
	}
	const { data, isError, isLoading, error } = useDataLoading(fetchDataLoading, navigation)
	const [products, setProducts] = useState<ProductListRenderItem[]>([])
	const { selectedDetailTypeIndex, update } = useStore((state) => ({
		selectedDetailTypeIndex: state.listScreen.selectedDetailTypeIndex,
		update: state.update,
	}))

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
		setWidthRate(WIDTH / 360)
	}, [])

	useEffect(() => {
		if (data) {
			const products = _.chunk(data as ProductListResponse[], 2).map((item, index) => {
				return {
					id: index,
					itemLeft: item[0],
					itemRight: item[1],
				}
			})
			setProducts(products)
		}
	}, [data])

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
	const getDescription = (description: string) => {
		return description?.length > 30 ? description.substring(0, 30) + "..." : description
	}

	const renderProductsItem = useCallback(
		(item: ProductListResponse) => {
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
							width: 165 * widthRate,
							backgroundColor: Color.white,
							borderRadius: 10,
							borderColor: Color.white,
							borderWidth: 1,
							shadowColor: "#000",
							shadowOffset: {
								width: 0,
								height: 1,
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
						}}>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 10,
								paddingTop: 10,
								backgroundColor: Color.white,
								borderColor: Color.white,
								paddingBottom: 5,
							}}>
							<Image
								source={{
									uri: item.main_product_image,
								}}
								style={{ width: 154 * widthRate, height: 154 * widthRate, borderRadius: 5 }}
								resizeMode={"stretch"}
							/>
							{item.promotionyn && (
								<Image
									source={promotion_mark}
									style={{
										position: "absolute",
										top: 0,
										bottom: 0,
										left: 0,
										right: 0,
										width: 30,
										height: 30,
										justifyContent: "center",
										alignItems: "center",
									}}
								/>
							)}
						</View>

						<View
							style={{
								flex: 1,
								paddingTop: 5,
								alignItems: "center",
								flexWrap: "wrap",
								backgroundColor: "#F4F4F4",
							}}>
							<View
								style={{
									width: "100%",
									alignItems: "flex-start",
								}}>
								{item.promotionyn ? (
									<View
										style={{
											paddingTop: 5,
											paddingLeft: 10,
											paddingBottom: 5,
										}}>
										<Image
											source={promotion_img}
											style={{
												width: 40,
												height: 12,
											}}
										/>
									</View>
								) : (
									<View
										style={{
											paddingTop: 5,
											paddingLeft: 10,
											paddingBottom: 5,
										}}>
										<Image
											source={normal_img}
											style={{
												width: 40,
												height: 12,
											}}
										/>
									</View>
								)}
							</View>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										fontStyle: "normal",
										color: Color.black,
										fontWeight: "500",
										paddingHorizontal: 10,
										fontSize: 15,
										height: 50,
									}}>
									{getTitle(item.title)}
								</Text>
							</View>
							<View
								style={{
									marginBottom: 10,
									backgroundColor: "#F4F4F4",
									width: 140,
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										color: "#0033B7",
										fontWeight: "700",
										fontSize: 16,
									}}>{`${getPrice(item.price)} P`}</Text>
							</View>
						</View>
						<Divider />
						{item.promotionyn ? (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									paddingVertical: 5,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
									backgroundColor: "#FFDD65",
									height: 26,
								}}>
								<AutoHeightImage source={starbucks_coupon} width={79} />
							</View>
						) : (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									paddingVertical: 5,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
									backgroundColor: "#D1D1D1",
									height: 26,
								}}>
								<Text style={{ fontStyle: "normal", fontWeight: "700", fontSize: 12 }}>
									{`${item.request_promotion_max}명 까지 ${item.request_promotion_count}명 요청 중`}
								</Text>
							</View>
						)}
					</View>
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderItem = (item: ProductListRenderItem) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 11,
					paddingTop: 11,
					paddingBottom: 2,
					width: WIDTH,
				}}>
				{item.itemLeft && renderProductsItem(item.itemLeft)}
				{item.itemRight && renderProductsItem(item.itemRight)}
			</View>
		)
	}

	return (
		<>
			<Topbar title={"답례품 리스트"} isLeft isHome />
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
				<>
					<View
						style={{
							flex: 1,
							alignItems: "center",
							backgroundColor: "#F3F3F3",
						}}>
						<FlatList
							data={products}
							initialNumToRender={15}
							keyExtractor={(item, index) => `${index}_${item.id}`}
							renderItem={({ item }) => renderItem(item)}
							contentInsetAdjustmentBehavior="automatic"
							showsVerticalScrollIndicator={false}
						/>
						<View style={{ backgroundColor: Color.transparent, marginTop: 5 }} />
					</View>
				</>
			)}
		</>
	)
}

export default ProductsListScreen3
