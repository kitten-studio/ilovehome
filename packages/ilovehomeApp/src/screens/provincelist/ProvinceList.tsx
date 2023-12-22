import { StackScreenProps } from "@react-navigation/stack"
import React, { FC, useEffect, useState } from "react"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import Topbar from "../components/Topbar"
import { ViewDimension } from "../lib/ViewDimension"
import {
	ProvinceList,
	강원특별자치도,
	경기도,
	경상남도,
	경상북도,
	광주광역시,
	대구광역시,
	대전광역시,
	부산광역시,
	서울특별시,
	울산광역시,
	인천광역시,
	전라남도,
	전라북도,
	제주특별자치,
	충청남도,
	충청북도,
} from "./ProvinceData"

export type ProvinceListProps = StackScreenProps<AppStackParamList, "ProvinceList">

const WIDTH = ViewDimension.get().width

const ProvinceListScreen: FC<ProvinceListProps> = ({ route, navigation }) => {
	const { provinceName } = route.params
	const [widthRate, setWidthRate] = useState(1)
	const [province, setProvince] = useState<ProvinceList[]>([])
	const [title, setTitle] = useState("")
	const ProvinceData = {
		seoulIMG: {
			title: "서울특별시",
			...서울특별시,
		},
		busanIMG: {
			title: "부산광역시",
			...부산광역시,
		},
		daeguIMG: {
			title: "대구광역시",
			...대구광역시,
		},
		incheonIMG: {
			title: "인천광역시",
			...인천광역시,
		},
		gangjuIMG: {
			title: "광주광역시",
			...광주광역시,
		},
		daejeonIMG: {
			title: "대전광역시",
			...대전광역시,
		},
		ulsanIMG: {
			title: "울산광역시",
			...울산광역시,
		},
		gyeonggiIMG: {
			title: "경기도",
			...경기도,
		},
		gangwonIMG: {
			title: "강원특별자치도",
			...강원특별자치도,
		},
		chungbukIMG: {
			title: "충청북도",
			...충청북도,
		},
		chungnamIMG: {
			title: "충청남도",
			...충청남도,
		},
		jeonbukIMG: {
			title: "전라북도",
			...전라북도,
		},
		jeonnamIMG: {
			title: "전라남도",
			...전라남도,
		},
		gyeongbukIMG: {
			title: "경상북도",
			...경상북도,
		},
		gyeongnamIMG: {
			title: "경상남도",
			...경상남도,
		},
		jejuIMG: {
			title: "제주특별자치",
			...제주특별자치,
		},
	}

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
		setWidthRate(WIDTH / 360)
		if (provinceName === "sejong06") {
			return
		}
		setProvince(ProvinceData[provinceName].Province)
		setTitle(ProvinceData[provinceName].title)
	}, [])

	const onPressProvince = (itemName: string) => {
		navigation.push("ProductsList3", {
			type: "FindByLocal",
			itemName: ProvinceData[provinceName].title + " " + itemName,
		})
	}

	const renderProvinceItem = (key: number, Province: { Province01: string; Province02: string; Province03: string }) => {
		return (
			<View key={key} style={{ flexDirection: "row", marginTop: 10 }}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						onPressProvince(Province.Province01)
					}}>
					{Province.Province01 && (
						<View
							style={{
								marginHorizontal: 10,
								backgroundColor: "#FFFFFF",
								width: 87,
								height: 31,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 4,
							}}>
							<Text
								style={{
									fontStyle: "normal",
									color: Color.black,
									fontWeight: "700",
									fontSize: 16,
								}}>
								{Province.Province01}
							</Text>
						</View>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						onPressProvince(Province.Province02)
					}}>
					{Province.Province02 && (
						<View
							style={{
								marginHorizontal: 10,
								backgroundColor: "#FFFFFF",
								width: 87,
								height: 31,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 4,
							}}>
							<Text
								style={{
									fontStyle: "normal",
									color: Color.black,
									fontWeight: "700",
									fontSize: 16,
								}}>
								{Province.Province02}
							</Text>
						</View>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						onPressProvince(Province.Province03)
					}}>
					{Province.Province03 && (
						<View
							style={{
								marginHorizontal: 10,
								backgroundColor: "#FFFFFF",
								width: 87,
								height: 31,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 4,
							}}>
							<Text
								style={{
									fontStyle: "normal",
									color: Color.black,
									fontWeight: "700",
									fontSize: 16,
								}}>
								{Province.Province03}
							</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<>
			<Topbar title={"지역선택"} isLeft />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#F3F3F3",
				}}>
				<View
					style={{
						marginTop: 20,
						backgroundColor: "#FFFFFF",
						width: 245,
						height: 33,
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 4,
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "700",
							fontSize: 16,
						}}>
						{title}
					</Text>
				</View>

				<ScrollView style={{ marginTop: 50 }}>
					{province.map((item, index) => (
						<>{renderProvinceItem(index, item)}</>
					))}
				</ScrollView>
			</View>
		</>
	)
}

export default ProvinceListScreen
