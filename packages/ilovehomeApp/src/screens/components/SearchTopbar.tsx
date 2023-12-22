import React, { FC } from "react"
import { TouchableOpacity, View } from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import { ViewDimension } from "../lib/ViewDimension"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AppStackParamList } from "@main/@types/params"

const logo1Img = require("@main/static/topbar/logo_1.png")
const logo2Img = require("@main/static/topbar/logo_2.png")
const searchbarAImg = require("@main/static/topbar/SearchbarA.png")

const WIDTH = ViewDimension.get().width

interface SearchTopbarProps {}

const SearchTopbar: FC<SearchTopbarProps> = () => {
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
	return (
		<View
			style={{
				justifyContent: "space-between",
				flexDirection: "row",
				backgroundColor: "#009abc",
				height: 56,
			}}>
			<View style={{ flex: 1, justifyContent: "flex-end" }}>
				<AutoHeightImage source={logo1Img} width={104} style={{ marginLeft: 10, marginBottom: 5 }} />
				<AutoHeightImage source={logo2Img} width={187} style={{ marginLeft: 10, marginBottom: 10, marginTop: 2 }} />
			</View>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => {
					navigation.push("SearchItems")
				}}>
				<View style={{ flex: 0.8, justifyContent: "center" }}>
					<AutoHeightImage source={searchbarAImg} width={148} style={{ marginRight: 10 }} />
				</View>
			</TouchableOpacity>
		</View>
	)
}

export default SearchTopbar
