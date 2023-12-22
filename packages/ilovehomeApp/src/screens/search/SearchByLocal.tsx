import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useEffect } from "react"
import { Image, ImageURISource, StatusBar, TouchableOpacity, View } from "react-native"
import { AppStackParamList, ProvinceName } from "../../@types/params"
import { Color } from "../common/Color"
import Topbar from "../components/Topbar"
import { ViewDimension } from "../lib/ViewDimension"

export type SearchByLocalProps = NativeStackScreenProps<AppStackParamList, "SearchByLocal">

const map3dImg = require("@main/static/search_by_local/3dmap.png")
const titleImg = require("@main/static/search_by_local/title.png")
const 서울IMG = require("@main/static/search_by_local/seoul.png")
const 인천IMG = require("@main/static/search_by_local/incheon.png")
const 강원IMG = require("@main/static/search_by_local/gangwon.png")
const 경기IMG = require("@main/static/search_by_local/gyeonggi.png")
const 충북IMG = require("@main/static/search_by_local/chungbuk.png")
const 세종IMG = require("@main/static/search_by_local/sejong.png")
const 대전IMG = require("@main/static/search_by_local/daejeon.png")
const 충남IMG = require("@main/static/search_by_local/chungnam.png")
const 경북IMG = require("@main/static/search_by_local/gyeongbuk.png")
const 전북IMG = require("@main/static/search_by_local/jeonbuk.png")
const 대구IMG = require("@main/static/search_by_local/daegu.png")
const 경남IMG = require("@main/static/search_by_local/gyeongnam.png")
const 광주IMG = require("@main/static/search_by_local/gwangju.png")
const 울산IMG = require("@main/static/search_by_local/ulsan.png")
const 부산IMG = require("@main/static/search_by_local/busan.png")
const 전남IMG = require("@main/static/search_by_local/jeonnam.png")
const 제주IMG = require("@main/static/search_by_local/jeju.png")

const SearchByLocalScreen: FC<SearchByLocalProps> = ({ navigation }) => {
	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
	}, [])

	const renderProvice = (title: string, img: ImageURISource, left: number, top: number) => {
		return (
			<View
				style={{
					position: "absolute",
					left: left + 25,
					top: top - 40,
					width: 45,
					height: 45,
				}}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						const provinceName = title as ProvinceName
						if (provinceName === "sejong06" || provinceName === "jejuIMG") {
							navigation.push("ProductsList3", {
								type: "FindByLocal",
								itemName: provinceName,
							})
							return
						}
						navigation.push("ProvinceList", { provinceName: provinceName })
					}}>
					<Image
						source={img}
						style={{
							width: 45,
							height: 45,
						}}
					/>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<>
			<Topbar title={"지역선택"} isLeft isHome />
			<View
				style={{
					flex: 1,
					// alignItems: "center",
					// justifyContent: "center",
					backgroundColor: Color.white,
				}}>
				<View style={{ alignItems: "center", paddingTop: 22 }}>
					<Image source={titleImg} style={{ width: 245, height: 33, resizeMode: "contain" }} />
				</View>
				<View
					style={{
						flex: 1,
						// alignItems: "center",
						backgroundColor: Color.white,
					}}>
					<Image source={map3dImg} style={{ width: 360, height: 619 }} />
				</View>
				{renderProvice("seoulIMG", 서울IMG, 103, 191)}
				{renderProvice("incheonIMG", 인천IMG, 50, 223)}
				{renderProvice("gangwonIMG", 강원IMG, 200, 200)}
				{renderProvice("gyeonggiIMG", 경기IMG, 108, 244)}
				{renderProvice("chungbukIMG", 충북IMG, 166, 267)}
				{renderProvice("sejong06", 세종IMG, 101, 295)}
				{renderProvice("daejeonIMG", 대전IMG, 149, 323)}
				{renderProvice("chungnamIMG", 충남IMG, 53, 304)}
				{renderProvice("gyeongbukIMG", 경북IMG, 250, 297)}
				{renderProvice("jeonbukIMG", 전북IMG, 101, 368)}
				{renderProvice("daeguIMG", 대구IMG, 228, 356)}
				{renderProvice("gyeongnamIMG", 경남IMG, 173, 401)}
				{renderProvice("gangjuIMG", 광주IMG, 72, 414)}
				{renderProvice("ulsanIMG", 울산IMG, 282, 393)}
				{renderProvice("busanIMG", 부산IMG, 232, 422)}
				{renderProvice("jeonnamIMG", 전남IMG, 90, 467)}
				{renderProvice("jejuIMG", 제주IMG, 45, 585)}
			</View>
		</>
	)
}

export default SearchByLocalScreen
