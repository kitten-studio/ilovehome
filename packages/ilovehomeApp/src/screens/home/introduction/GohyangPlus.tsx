import React, { FC, useEffect, useState } from "react"
import { View, Text, ScrollView, Image, StatusBar } from "react-native"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import { ViewDimension } from "@main/screens/lib/ViewDimension"
import AutoHeightImage from "react-native-auto-height-image"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AppStackParamList } from "@main/@types/params"
import { StorageManager } from "@main/screens/lib/StorageManager"
import Constants from "@main/common/Constants"

const howToApplyForPromotionGuideTitle00Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle00.png")
const howToApplyForPromotionGuideTitle01Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle01.png")
const howToApplyForPromotionGuideTitle02Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle02.png")
const howToApplyForPromotionGuideTitle03Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle03.png")
const howToApplyForPromotionGuideTitle04Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle04.png")
const howToApplyForPromotionGuideTitle05Img = require("@main/static/introduction/howToApplyForPromotionGuideTitle05.png")

const WIDTH = ViewDimension.get().width

interface GohyangPlusGuideScreenProps {}

const GohyangPlusGuideScreen: FC<GohyangPlusGuideScreenProps> = () => {
	const [widthRate, setWidthRate] = useState(1)
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")

		setWidthRate(WIDTH / 360)
	}, [])
	return (
		<View style={{ backgroundColor: "white" }}>
			<Topbar
				title={"프로모션 답례품 신청방법"}
				isClose
				onClose={() => {
					StorageManager.getInstance().set(Constants.LOCAL_USER_FIRST_TUTORIAL, "true")
					navigation.goBack()
				}}
			/>
			<ScrollView>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle00Img} width={229} />
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle01Img} width={310} />
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle02Img} width={310} />
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle03Img} width={310} />
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle04Img} width={311} />
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 21,
						paddingBottom: 21,
					}}>
					<AutoHeightImage source={howToApplyForPromotionGuideTitle05Img} width={233} />
				</View>
			</ScrollView>
		</View>
	)
}

export default GohyangPlusGuideScreen
