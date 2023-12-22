import { ViewDimension } from "@main/screens/lib/ViewDimension"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import * as _ from "lodash"
import React, { FC, useEffect, useMemo, useState } from "react"
import { Image, ImageSourcePropType, ScrollView, StatusBar, TouchableOpacity, View } from "react-native"
import { AppStackParamList, FindingItemsType } from "../../@types/params"

const findBySomethingItemEmptyImg = require("@main/static/home/FindBySomething_ItemEmpty.png")
const findBySomethingCardBannerImg = require("@main/static/home/FindBySomething_CardBanner.png")

const FindBySomething_MoneyItem1000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem1000.png")
const FindBySomething_MoneyItem3000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem3000.png")
const FindBySomething_MoneyItem5000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem5000.png")
const FindBySomething_MoneyItem10000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem10000.png")
const FindBySomething_MoneyItem15000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem15000.png")
const FindBySomething_MoneyItem20000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem20000.png")
const FindBySomething_MoneyItem25000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem25000.png")
const FindBySomething_MoneyItem30000Img = require("@main/static/searchbysomething/FindBySomething_MoneyItem30000.png")

const FindBySomething_AdvertisingServices = require("@main/static/searchbysomething/FindBySomething_AdvertisingServices.png") // 관광서비스 M08
const FindBySomething_ItemAgriculturalImg = require("@main/static/searchbysomething/FindBySomething_ItemAgricultural.png")
const FindBySomething_ItemAgricultural2Img = require("@main/static/searchbysomething/FindBySomething_ItemAgricultural2.png") // 농축산물 M01
const FindBySomething_ItemDailySuppliesImg = require("@main/static/searchbysomething/FindBySomething_ItemDailySupplies.png") // 생활용품 M05
const FindBySomething_ItemEtcProductsImg = require("@main/static/searchbysomething/FindBySomething_ItemEtcProducts.png") // 기타상품 M08
const FindBySomething_ItemLiveStockImg = require("@main/static/searchbysomething/FindBySomething_ItemLiveStock.png")
const FindBySomething_ItemLocalProductsImg = require("@main/static/searchbysomething/FindBySomething_ItemLocalProducts.png") // 직역상품권 M06
const FindBySomething_ItemMarineImg = require("@main/static/searchbysomething/FindBySomething_ItemMarine.png") // 수산물 M02
const FindBySomething_ItemProcessedFoodImg = require("@main/static/searchbysomething/FindBySomething_ItemProcessedFood.png") // 가공식품 M04

interface ContentsInfoType {
	itemName: string
	image: ImageSourcePropType
}

interface ContentsType {
	type: string
	info: ContentsInfoType[]
}
const contents: ContentsType[] = [
	{
		type: "FindByAmount",
		info: [
			{
				itemName: "MoneyItem1000",
				image: FindBySomething_MoneyItem1000Img,
			},
			{
				itemName: "MoneyItem3000",
				image: FindBySomething_MoneyItem3000Img,
			},
			{
				itemName: "MoneyItem5000",
				image: FindBySomething_MoneyItem5000Img,
			},
			{
				itemName: "MoneyItem10000",
				image: FindBySomething_MoneyItem10000Img,
			},
			{
				itemName: "MoneyItem15000",
				image: FindBySomething_MoneyItem15000Img,
			},
			{
				itemName: "MoneyItem20000",
				image: FindBySomething_MoneyItem20000Img,
			},
			{
				itemName: "MoneyItem25000",
				image: FindBySomething_MoneyItem25000Img,
			},
			{
				itemName: "MoneyItem30000",
				image: FindBySomething_MoneyItem30000Img,
			},
			{
				itemName: "MoneyItemEmpty",
				image: findBySomethingItemEmptyImg,
			},
		],
	},
	{
		type: "FindByProducts",
		info: [
			{
				itemName: "tour",
				image: FindBySomething_AdvertisingServices,
			},
			{
				itemName: "farm",
				image: FindBySomething_ItemAgricultural2Img,
			},
			{
				itemName: "aquatic",
				image: FindBySomething_ItemMarineImg,
			},
			{
				itemName: "process",
				image: FindBySomething_ItemProcessedFoodImg,
			},
			{
				itemName: "daily",
				image: FindBySomething_ItemDailySuppliesImg,
			},
			{
				itemName: "ticket",
				image: FindBySomething_ItemLocalProductsImg,
			},
			{
				itemName: "etc",
				image: FindBySomething_ItemEtcProductsImg,
			},
			{
				itemName: "MoneyItemEmpty",
				image: findBySomethingItemEmptyImg,
			},
			{
				itemName: "MoneyItemEmpty",
				image: findBySomethingItemEmptyImg,
			},
		],
	},
]

const WIDTH = ViewDimension.get().width
const ITEM_WIDTH = (ViewDimension.get().width - 28) / 3 - 2

export type SearchBySomethingScreenProps = NativeStackScreenProps<AppStackParamList, "SearchBySomething">

const SearchBySomethingScreen: FC<SearchBySomethingScreenProps> = ({ route, navigation }) => {
	const [widthRate, setWidthRate] = useState(1)

	const itemContents = useMemo(() => {
		const items = _.chain(contents)
			.filter((item) => item.type.includes(route.params?.type))
			.value()
		if (!_.isEmpty(items)) {
			return items[0]
		}
		return undefined
	}, [contents])

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
		setWidthRate(WIDTH / 360)
	}, [])

	const getTitle = (type: FindingItemsType) => {
		const title = { FindByAmount: "금액별", FindByGifts: "답례품", FindByLocal: "지역별", FindByRanking: "순위" }
		return title[type]
	}

	const renderFindingItem = (item: ContentsInfoType | undefined) => {
		if (_.isEmpty(item)) {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
					<Image
						source={findBySomethingItemEmptyImg}
						style={{ width: 108 * widthRate, height: 125 * widthRate, resizeMode: "contain" }}
					/>
				</TouchableOpacity>
			)
		}
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => {
					if (item?.itemName.includes("Empty")) return
					navigation.push("ProductsList3", {
						type: route.params?.type,
						itemName: item?.itemName,
					})
				}}>
				<Image source={item?.image} style={{ width: 108 * widthRate, height: 125 * widthRate, resizeMode: "contain" }} />
			</TouchableOpacity>
		)
	}

	const renderCardbanner = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingVertical: 11,
					paddingHorizontal: 11,

					width: WIDTH,
				}}
				onPress={() => {}}
			/>
		)
	}

	const renderItems = () => {
		return (
			<>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 14,
						paddingTop: 11,
						width: WIDTH,
					}}>
					{renderFindingItem(itemContents?.info[0])}
					{renderFindingItem(itemContents?.info[1])}
					{renderFindingItem(itemContents?.info[2])}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 14,
						paddingTop: 5,
						width: WIDTH,
					}}>
					{renderFindingItem(itemContents?.info[3])}
					{renderFindingItem(itemContents?.info[4])}
					{renderFindingItem(itemContents?.info[5])}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 14,
						paddingTop: 5,
						width: WIDTH,
					}}>
					{renderFindingItem(itemContents?.info[6])}
					{renderFindingItem(itemContents?.info[7])}
					{renderFindingItem(itemContents?.info[8])}
				</View>
				<View style={{ flex: 1 }}>{renderCardbanner()}</View>
			</>
		)
	}

	return (
		<>
			<Topbar title={getTitle(route.params?.type)} isLeft isHome />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f4f4f4",
				}}>
				<ScrollView>{renderItems()}</ScrollView>
			</View>
		</>
	)
}

export default SearchBySomethingScreen
