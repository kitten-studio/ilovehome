import { ViewDimension } from "@main/screens/lib/ViewDimension"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { numberWithCommas } from "../common/StringUtils"
import Divider from "../components/Divider"

const cartImage = require("@main/static/productdetail/Cart.png")
const donatingImage = require("@main/static/productdetail/Donating.png")

const WIDTH = ViewDimension.get().width
const donatingWidth = ViewDimension.get().width - 22

const defaultImage = require("@main/static/products/default_image.png")

type ProductImageType = {
	url: string
	width: number
	height: number
}

type ProductDetailScreenProps = NativeStackScreenProps<AppStackParamList, "ProductDetail2">

const ProductDetailScreen2: FC<ProductDetailScreenProps> = ({ route, navigation }) => {
	const { item } = route.params
	const [widthRate, setWidthRate] = useState(1)
	const [totalItemPrice, setTotalItemPrice] = useState(0)
	const [itemCounter, setItemCounter] = useState(1)
	const [product_images, setProductImages] = useState<string[]>([])

	useEffect(() => {
		setWidthRate(WIDTH / 360)
		setTotalItemPrice(item.price * itemCounter)
		setProductImages(_.toArray(item.product_images))
	}, [])

	const getProductImage = (url: string) => {
		const { width, height } = Image.resolveAssetSource({ uri: url })
	}

	const renderDonating = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingRight: 11,
					paddingLeft: 11,
				}}
				onPress={() => {}}>
				<Image source={donatingImage} style={{ width: donatingWidth, height: 43 }} />
			</TouchableOpacity>
		)
	}

	const getImageThumbnail = (url: string | null) => {
		if (_.isEmpty(url)) return defaultImage
		return {
			uri: url,
		}
	}

	const renderQuantityCounter = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						if (itemCounter > 1) {
							setItemCounter(itemCounter - 1)
						}
					}}>
					<View
						style={{
							borderColor: Color.black,
							borderWidth: 1,
							width: 50,
						}}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "900",
								color: Color.black,
							}}>
							{"    -"}
						</Text>
					</View>
				</TouchableOpacity>
				<View
					style={{
						width: 50,
						borderColor: Color.black,
						borderWidth: 1,
					}}>
					<Text style={{ fontSize: 18, fontWeight: "500", color: Color.black }}>{`    ${itemCounter}`}</Text>
				</View>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						setItemCounter(itemCounter + 1)
					}}>
					<View
						style={{
							width: 50,
							borderColor: Color.black,
							borderWidth: 1,
						}}>
						<Text style={{ fontSize: 18, fontWeight: "900", color: Color.black }}>{"    +"}</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	const renderProductDetailInfo = () => {
		return (
			<>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						flexDirection: "row",
					}}>
					<View style={{ backgroundColor: "#E95400", paddingVertical: 3, paddingLeft: 6, paddingRight: 6 }}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontWeight: "600",
							}}>
							{item.prefectureName}
						</Text>
					</View>
					<View style={{ flex: 1 }}></View>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "600",
							fontSize: 20,
						}}>
						{item.title}
					</Text>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: "#0030AD",
							fontWeight: "600",
							fontSize: 20,
						}}>
						{"판매가"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "600",
							fontSize: 20,
							paddingLeft: 50,
						}}>
						{`${numberWithCommas(item.price)}원`}
					</Text>
				</View>
				<Divider />
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
						}}>
						{"배송비"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
							paddingLeft: 50,
						}}>
						{`무료`}
					</Text>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
						}}>
						{"원산지"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
							paddingLeft: 50,
						}}>
						{`제주도`}
					</Text>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
						}}>
						{"제조사"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
							paddingLeft: 50,
						}}>
						{`제주농협조합공동사업법인`}
					</Text>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}
				/>
				<Divider />
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
						justifyContent: "space-between",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "600",
							fontSize: 20,
						}}>
						{"총 상품금액"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: "#0030AD",
							fontWeight: "600",
							fontSize: 20,
							paddingLeft: 70,
						}}>
						{`${numberWithCommas(item.price * itemCounter)}원`}
					</Text>
				</View>
			</>
		)
	}

	return (
		<>
			<Topbar title={"답례품 상세페이지"} isLeft />
			<ScrollView style={{ backgroundColor: "white" }}>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						paddingHorizontal: 12,
					}}>
					<Image source={getImageThumbnail(item.main_product_image)} style={{ width: WIDTH - 24, height: 207 * widthRate }} />
				</View>
				{renderProductDetailInfo()}
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						width: WIDTH,
					}}>
					{product_images.map((item, index) => {
						return <AutoHeightImage width={WIDTH} source={{ uri: item }} />
					})}
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
						width: WIDTH,
						backgroundColor: "white",
					}}
				/>
			</ScrollView>
			<View
				style={{
					justifyContent: "space-between",
					flexDirection: "row",
					alignItems: "center",
					width: WIDTH,
					height: 48,
					backgroundColor: "white",
				}}>
				{renderDonating()}
			</View>
		</>
	)
}

export default ProductDetailScreen2
