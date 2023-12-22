import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React, { FC, useEffect } from "react"
import { View, Image, Text, TouchableOpacity, StatusBar } from "react-native"
import { IndexTabParamList, AppStackScreenProps, AppStackParamList } from "../../@types/params"
import Topbar from "../components/Topbar"

export type FavoritesTabScreenProps<T extends keyof IndexTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<IndexTabParamList, T>,
	AppStackScreenProps<keyof AppStackParamList>
>

const freeIconLoveImg = require("@main/static/favorite/free-icon-love.png")
const goToProductListImg = require("@main/static/favorite/go-to-product-list.png")

const FavoritesScreen: FC<FavoritesTabScreenProps<"Favorites">> = ({ navigation }) => {
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#009abc")
			StatusBar.setBarStyle("dark-content")
		})

		return unsubscribe
	}, [])

	return (
		<>
			<Topbar title={"찜"} color={"#009abc"} />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#ffffff",
				}}>
				<View style={{ width: "100%", alignItems: "center" }}>
					<Image source={freeIconLoveImg} style={{ width: 90, height: 90 }} />
					<Text style={{ fontStyle: "normal", fontWeight: "700" }}>찜한 상품이 없습니다.</Text>
					<Text style={{ fontStyle: "normal" }}>다양한 지자체 답례품을 만나보세요.</Text>
					<TouchableOpacity
						style={{ width: "100%" }}
						activeOpacity={0.5}
						onPress={() => {
							navigation.push("SearchByRanking")
						}}>
						<Image source={goToProductListImg} style={{ width: "100%", height: 52, marginTop: 50 }} />
					</TouchableOpacity>
				</View>
				<Text style={{ fontStyle: "normal", padding: 20, fontSize: 13 }}>
					찜리스트에 담긴 상품은 최대 30일간 보관되며 최대 20개의 상품을 찜할 수 있습니다.
				</Text>
			</View>
		</>
	)
}

export default FavoritesScreen
