import { ProductListResponse } from "@main/@types/response"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import Topbar from "../components/Topbar"
import { useDataLoading } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"

const defaultImage = require("@main/static/products/default_image.png")

const WIDTH = ViewDimension.get().width

type ProductsListScreenProps = NativeStackScreenProps<AppStackParamList, "ProductsList">

type ProductListRenderItem = {
	itemLeft: ProductListResponse
	itemRight?: ProductListResponse
}

const ProductsListScreen2: FC<ProductsListScreenProps> = ({ navigation }) => {
	const [widthRate, setWidthRate] = useState(1)
	const fetchDataLoading = {
		queryKey: ["product/list"],
		url: "product/list",
		data: {
			title: "jeldino@gmail.com",
			description: "1234",
			price: 51,
		},
	}
	const { data, isError, isLoading, error } = useDataLoading(fetchDataLoading)
	const [products, setProducts] = useState<ProductListRenderItem[]>([])

	useEffect(() => {
		setWidthRate(WIDTH / 360)
		// console.log(`### process.env.STAGE ${process.env.STAGE}`)
	}, [])

	useEffect(() => {
		if (data) {
			const products = _.chunk(data as ProductListResponse[], 2).map((item) => {
				return {
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

	const renderItem = (item: ProductListResponse) => {
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
				<View
					style={{
						borderRadius: 10,
						backgroundColor: Color.white,
						marginVertical: 3,
						flexDirection: "row",
						height: 100 * widthRate,
						width: 360 * widthRate - 20,
					}}>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 12,
						}}>
						<Image source={getImageThumbnail(item.image_thumbnail)} style={{ width: 120, height: 88, borderRadius: 5 }} />
					</View>
					<View
						style={{
							flex: 1,
							alignItems: "flex-start",
							justifyContent: "center",
							paddingHorizontal: 12,
						}}>
						<Text style={{ fontStyle: "normal", color: Color.black, fontWeight: "700", paddingBottom: 5 }}>{item.title}</Text>
						<Text style={{ fontStyle: "normal", color: "#0033B7", fontWeight: "700" }}>{`${getPrice(item.price)}원`}</Text>
						<Text style={{ fontStyle: "normal", color: "#0033B7" }}>{item.prefectureName}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<>
			<Topbar title={"답례품 리스트"} isLeft />
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

export default ProductsListScreen2
