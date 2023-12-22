import React, { FC, useEffect, useState } from "react"
import { View, Text, ScrollView, Image, StatusBar } from "react-native"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import { ViewDimension } from "@main/screens/lib/ViewDimension"

const introductionGudieDetailImage01 = require("@main/static/introduction/IntroductionGudieDetail01.png")
const introductionGudieDetailImage02 = require("@main/static/introduction/IntroductionGudieDetail02.png")
const introductionGudieDetailImage03 = require("@main/static/introduction/IntroductionGudieDetail03.png")
const introductionGudieDetailImage04 = require("@main/static/introduction/IntroductionGudieDetail04.png")
const introductionGudieDetailImage05 = require("@main/static/introduction/IntroductionGudieDetail05.png")
const introductionGudieDetailImage06 = require("@main/static/introduction/IntroductionGudieDetail06.png")

const WIDTH = ViewDimension.get().width

interface IntroductionGuideScreenProps {}

const IntroductionGuideScreen: FC<IntroductionGuideScreenProps> = () => {
	const [widthRate, setWidthRate] = useState(1)
	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")

		setWidthRate(WIDTH / 360)
	}, [])
	return (
		<>
			<Topbar title={"고향사랑 기부제 안내"} isClose />
			<ScrollView>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
					}}>
					<Image
						source={introductionGudieDetailImage01}
						style={{ width: WIDTH, height: 92 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 22,
					}}>
					<Image
						source={introductionGudieDetailImage02}
						style={{ width: WIDTH, height: 241 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 22,
					}}>
					<Image
						source={introductionGudieDetailImage03}
						style={{ width: WIDTH, height: 166 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 22,
					}}>
					<Image
						source={introductionGudieDetailImage04}
						style={{ width: WIDTH, height: 276 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 22,
					}}>
					<Image
						source={introductionGudieDetailImage05}
						style={{ width: WIDTH, height: 304 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 22,
						paddingBottom: 22,
					}}>
					<Image
						source={introductionGudieDetailImage06}
						style={{ width: WIDTH, height: 349 * widthRate }}
						resizeMode={"contain"}
					/>
				</View>
			</ScrollView>
		</>
	)
}

export default IntroductionGuideScreen
