import React, { FC, useEffect, useState } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import { ViewDimension } from "@main/screens/lib/ViewDimension"

const productDetailInfoImage01 = require("@main/static/productdetail/ProductDetailInfo01.png")
const productDetailInfoImage02 = require("@main/static/productdetail/ProductDetailInfo02.png")
const productDetailInfoImage03 = require("@main/static/productdetail/ProductDetailInfo03.png")
const productDetailInfoImage04 = require("@main/static/productdetail/ProductDetailInfo04.png")
const productDetailInfoImage05 = require("@main/static/productdetail/ProductDetailInfo05.png")
const cartImage = require("@main/static/productdetail/Cart.png")
const donatingImage = require("@main/static/productdetail/Donating.png")

const WIDTH = ViewDimension.get().width
const donatingWidth = ViewDimension.get().width - 22 - 100 - 6

interface ProductDetailScreenProps {}

const ProductDetailScreen: FC<ProductDetailScreenProps> = () => {
	const [widthRate, setWidthRate] = useState(1)
	useEffect(() => {
		setWidthRate(WIDTH / 360)
	}, [])

	const renderCart = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingLeft: 11,
				}}
				onPress={() => {}}>
				<Image source={cartImage} style={{ width: 100, height: 43 }} />
			</TouchableOpacity>
		)
	}

	const renderDonating = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingRight: 11,
				}}
				onPress={() => {}}>
				<Image source={donatingImage} style={{ width: donatingWidth, height: 43 }} />
			</TouchableOpacity>
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
					}}>
					<Image
						source={productDetailInfoImage01}
						style={{ width: WIDTH, height: 207 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
					}}>
					<Image
						source={productDetailInfoImage02}
						style={{ width: WIDTH, height: 267 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						paddingRight: 11,
						paddingLeft: 11,
						width: WIDTH,
					}}>
					<Image
						source={productDetailInfoImage03}
						style={{ width: WIDTH - 22, height: 167 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						width: WIDTH,
					}}>
					<Image
						source={productDetailInfoImage04}
						style={{ width: WIDTH, height: 604 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						width: WIDTH,
						backgroundColor: "white",
					}}
				/>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						width: WIDTH,
						backgroundColor: "#efffeb",
					}}>
					<Image
						source={productDetailInfoImage05}
						style={{ width: WIDTH, height: 222 * widthRate }}
						resizeMode={"contain"}
					/>
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
				{renderCart()}
				{renderDonating()}
			</View>
		</>
	)
}

export default ProductDetailScreen
