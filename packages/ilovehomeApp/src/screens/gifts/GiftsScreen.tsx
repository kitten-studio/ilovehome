import React, { FC, useCallback, useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, ImageSourcePropType, StatusBar, FlatList } from "react-native"
import { AppStackParamList } from "../../@types/params"
import Topbar from "../components/Topbar"
import { ViewDimension } from "../lib/ViewDimension"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { loginStore } from "../lib/account/LoginStore"
import api from "../lib/api/api"
import { ProductListRenderItem, ProductListResponse } from "@main/@types/response"
import _ from "lodash"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import { Color } from "../common/Color"
import AutoHeightImage from "react-native-auto-height-image"
import Divider from "../components/Divider"

const promotion_mark = require("@main/static/products/promotion_mark.png")
const question_mark = require("@main/static/products/question_mark.png")
const starbucks_coupon = require("@main/static/products/starbucks_coupon.png")
const cu_coupon = require("@main/static/products/cu_coupon.png")
const request_coupon = require("@main/static/products/request_coupon.png")

const promotion_img = require("@main/static/products/promotion_img.png")
const normal_img = require("@main/static/products/normal_img.png")

const defaultImage = require("@main/static/products/default_image.png")

const WIDTH = ViewDimension.get().width

type ProductsListScreenProps = NativeStackScreenProps<AppStackParamList, "ProductsList">

const GiftsScreen: FC<ProductsListScreenProps> = ({ navigation }) => {
	const [widthRate, setWidthRate] = useState(1)
	const [products, setProducts] = useState<ProductListRenderItem[]>([])
	const [isError, setIsError] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#009abc")
			StatusBar.setBarStyle("dark-content")
			fetchDataLoading()
		})
		setWidthRate(WIDTH / 360)

		return unsubscribe
	}, [])

	const fetchDataLoading = async () => {
		setIsLoading(true)
		const userInfo = await loginStore.getUserInfo()
		const fetchDataLoading = {
			queryKey: ["product/ranking"],
			url: "product/ranking",
			data: {
				userId: userInfo?.userId ?? "",
			},
		}

		try {
			const response = await api.post<ProductListResponse>(
				`${process.env.API_HOST}/${fetchDataLoading.url}`,
				fetchDataLoading.data
			)

			if (!_.isEmpty(response.data) && response.status === 200) {
				const data = response.data as unknown
				const products = _.chunk(data as ProductListResponse[], 2).map((item, index) => {
					return {
						id: index,
						itemLeft: item[0],
						itemRight: item[1],
					}
				})
				setProducts(products)
				setIsLoading(false)
			}
		} catch (e) {
			setIsLoading(false)
			setIsError(true)
		}
	}

	const renderRankingItems = () => {
		return (
			<>
				{isLoading && <LoadingView />}
				{isError && <NetworkError />}
				{products?.length !== 0 && (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							backgroundColor: "#F3F3F3",
							paddingTop: 10,
						}}>
						<FlatList
							data={products}
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

	const renderItem = (item: ProductListRenderItem) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 11,
					paddingTop: 5,
					paddingBottom: 2,
					width: WIDTH,
				}}>
				{item.itemLeft && renderProductsItem(item.itemLeft)}
				{item.itemRight && renderProductsItem(item.itemRight)}
			</View>
		)
	}

	const getTitle = (title: string) => {
		return title?.length > 20 ? title.substring(0, 20) + "..." : title
	}
	const getDescription = (description: string) => {
		return description?.length > 30 ? description.substring(0, 30) + "..." : description
	}
	const getPrice = (price: number) => {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
							// borderBottomLeftRadius: 10,
							// borderBottomRightRadius: 10,
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
								height: 184 * widthRate,
							}}>
							<Image
								style={{ borderRadius: 5, width: 150, height: 150 }}
								source={item.main_product_image ? { uri: item.main_product_image } : defaultImage}
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
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => {
									// console.log(`### touch`)
								}}>
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
							</TouchableOpacity>
						)}
					</View>
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	return (
		<>
			<Topbar title={"답례품 요청 랭킹"} color={"#009abc"} />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					backgroundColor: "#F3F3F3",
				}}>
				{renderRankingItems()}
			</View>
		</>
	)
}

export default GiftsScreen
