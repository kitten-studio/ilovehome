import { ProductListRenderItem, ProductListResponse, VersionInfoResponse } from "@main/@types/response"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import SplashScreen from "react-native-splash-screen" /** 추가 **/
import _ from "lodash"
import React, { FC, useCallback, useEffect, useState } from "react"
import {
	Alert,
	AppState,
	BackHandler,
	FlatList,
	Image,
	Linking,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import { ScrollView } from "react-native-virtualized-view"
import { AppStackParamList, AppStackScreenProps, FindingItemsType, IndexTabParamList } from "../../@types/params"
import { Color } from "../common/Color"
import Divider from "../components/Divider"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import SearchTopbar from "../components/SearchTopbar"
import { useBackPressEffect } from "../hooks/useBackPressEffect"
import { useDataLoading } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"
import { useStore } from "../lib/Zustand"
import { loginStore } from "../lib/account/LoginStore"
import { CardBanner } from "./CardBanner"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"
import api from "../lib/api/api"
import { DeviceInfos } from "../lib/DeviceInfo"
import InAppBrowser from "../lib/InAppBrowser"
import { DeviceInfoUtil } from "../lib/utils/DeviceInfoUtil"

const WIDTH = ViewDimension.get().width
const HEIGHT = ViewDimension.get().height

const splash_image = require("@main/static/app_permission/splash_image.png")
const introductionImage = require("@main/static/introduction/introduction_guide.png")
const CalculateDonationPointsImg = require("@main/static/introduction/CalculateDonationPoints.png")

const IntroductItems = {
	IntroductionImg: require("@main/static/introduction/AppIntroduceGuide.png"),
	CalculateDonationPointsImg: require("@main/static/introduction/CalculateDonationPoints.png"),
}

const simulatingImage = require("@main/static/home/Simulating.png")
const cardbannerImage = require("@main/static/home/cardbanner.png")
// const mainPromotionImage = require("@main/static/home/main_promotion.jpg")

const todayIsDiscoveryImage = require("@main/static/home/TodayIsDiscovery.png")
const todayRecommandItems = require("@main/static/home/TodayRecommandItems.png")

const promotion_img = require("@main/static/products/promotion_img.png")
const normal_img = require("@main/static/products/normal_img.png")

const promotion_mark = require("@main/static/products/promotion_mark.png")
const question_mark = require("@main/static/products/question_mark.png")
const starbucks_coupon = require("@main/static/products/starbucks_coupon.png")
const cu_coupon = require("@main/static/products/cu_coupon.png")
const request_coupon = require("@main/static/products/request_coupon.png")

const FindingItems = {
	FindByAmount: require("@main/static/home/FindByAmount.png"),
	FindByProducts: require("@main/static/home/FindByGifts.png"),
	FindByLocal: require("@main/static/home/FindByLocal.png"),
	FindByPromotion: require("@main/static/home/FindByRanking.png"),
}

const TodayIsDiscoveryItems = {
	TodayIsDiscoveryItem1: require("@main/static/home/TodayIsDiscoveryItem1.png"),
	TodayIsDiscoveryItem2: require("@main/static/home/TodayIsDiscoveryItem2.png"),
	TodayIsDiscoveryItem3: require("@main/static/home/TodayIsDiscoveryItem3.png"),
	TodayIsDiscoveryItem4: require("@main/static/home/TodayIsDiscoveryItem4.png"),
}
type TodayIsDiscoveryItemsType = "TodayIsDiscoveryItem1" | "TodayIsDiscoveryItem2" | "TodayIsDiscoveryItem3" | "TodayIsDiscoveryItem4"

const defaultImage = require("@main/static/products/default_image.png")

const FindingItemWith = (ViewDimension.get().width - 22) / 2 - 6

export type HomeTabScreenProps<T extends keyof IndexTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<IndexTabParamList, T>,
	AppStackScreenProps<keyof AppStackParamList>
>

const HomeScreen: FC<HomeTabScreenProps<"Home">> = ({ navigation }) => {
	const [widthRate, setWidthRate] = useState(1)
	const [appState, setAppState] = useState(AppState.currentState)
	const { update } = useStore((state) => ({
		update: state.update,
	}))

	const fetchDataLoading = {
		queryKey: ["recommend/main/list"],
		url: "recommend/main/list",
		data: {
			title: "jeldino@gmail.com",
		},
	}
	const { data, isError, isLoading, error } = useDataLoading(fetchDataLoading)
	const [products, setProducts] = useState<ProductListRenderItem[]>([])

	useBackPressEffect({})

	useEffect(() => {
		const handleAppStateChange = (nextAppState) => {
			if (appState.match(/inactive|background/) && nextAppState === "active") {
				DeviceInfoUtil.checkDeviceNetConListener()
			}
			setAppState(nextAppState)
		}

		AppState.addEventListener("change", handleAppStateChange)
	}, [appState])

	useEffect(() => {
		if (data) {
			const products = _.chunk(data as ProductListResponse[], 2).map((item, index) => {
				return {
					id: index,
					itemLeft: item[0],
					itemRight: item[1],
				}
			})
			setProducts(products)
		}
	}, [data])

	useEffect(() => {
		SplashScreen.hide() /** 추가 **/
		DeviceInfoUtil.checkDeviceNetConListener()
		const run = async () => {
			const { result } = await checkAppForceUpdate()
			if (result) {
				return
			}
			const firstLogin = await StorageManager.getInstance().get<string>(Constants.LOCAL_USER_FIRST_LOGIN)
			const appPermission = await StorageManager.getInstance().get<string>(Constants.APP_PERMISSION_NOTICE)
			if (!firstLogin) {
				if (!appPermission) {
					navigation.push("AppPermissionNoticeModal")
				} else {
					navigation.push("GohyangPlusTutorial", {
						onClose: () => {
							const run = async () => {}
							run()
						},
					})
				}
				return
			}
			if (!(await loginStore.isLoggedIn())) {
				navigation.push("ProviderLoginModal", { isRegister: true })
			} else {
				const userInfo = await loginStore.getUserInfo(true)
				// console.log(`###`, JSON.stringify(userInfo))
				if (!_.isEmpty(userInfo)) {
					if (!userInfo?.isRegistered) {
						navigation.push("UserRegisterModal")
						return
					}
				}
			}
			const firstNotice = await StorageManager.getInstance().get<string>(Constants.LOCAL_USER_FIRST_NOTICE)
			if (!firstNotice) {
				navigation.push("PromotionNoticeModal")
				return
			}
		}

		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#009abc")
			StatusBar.setBarStyle("dark-content")

			run()
		})
		setWidthRate(WIDTH / 360)

		return unsubscribe
	}, [])

	const checkAppForceUpdate = async () => {
		const buildNumber = DeviceInfos.getBuildNumber()
		let result = false
		const { needshowOptionUpdate, forceUpdate } = await getCheckVersionInfo()
		if (Number(buildNumber) <= forceUpdate) {
			navigation.push("AppUpdateModal")
			result = true
		} else if (Number(buildNumber) <= needshowOptionUpdate) {
		}
		return {
			result,
		}
	}

	const openAppStore = () => {
		const storeLink = Platform.OS === "ios" ? "" : "market://details?id=com.ilovehomeapp"
		Linking.openURL(storeLink)
		BackHandler.exitApp()
	}

	const getCheckVersionInfo = async () => {
		const fetchDataLoading = {
			queryKey: ["service-info/app/version/info"],
			url: "service-info/app/version/info",
			data: {},
		}
		const response = await api.post<VersionInfoResponse>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response?.status === 200) {
			return {
				needshowOptionUpdate: data?.needshowOptionUpdate ?? 0,
				forceUpdate: data?.forceUpdate ?? 0,
			}
		}
		return {
			needshowOptionUpdate: 0,
			forceUpdate: 0,
		}
	}

	const renderIntroductionButton = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingVertical: 11,
					paddingHorizontal: 11,
					justifyContent: "center",
					alignItems: "center",
					width: WIDTH,
				}}
				onPress={() => {
					navigation.push("GohyangPlusGuide")
				}}>
				<Image source={introductionImage} style={{ width: 331 * widthRate, height: 41 * widthRate, resizeMode: "contain" }} />
			</TouchableOpacity>
		)
	}

	const renderIntroduceItem = useCallback(
		(type: string) => {
			return (
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						if (type === "IntroductionImg") {
							const url = "https://guide.ilovehome.kr"
							InAppBrowser.openInAppBrowser(url, "프로모션 신청 방법")
						} else if (type === "CalculateDonationPointsImg") {
							const url = "https://request.ilovehome.kr"
							InAppBrowser.openInAppBrowser(url, "프로모션 요청 방법")
						}
					}}>
					<AutoHeightImage source={IntroductItems[type]} width={165 * widthRate} />
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderFindingItem = useCallback(
		(itemType: FindingItemsType) => {
			return (
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						if (itemType === "FindByPromotion") {
							// 랭킹
							navigation.push("ProductsList3", {
								type: itemType,
								itemName: "itemName",
							})
						} else if (itemType === "FindByLocal") {
							// 지역
							navigation.push("SearchByLocal")
						} else {
							navigation.push("SearchBySomething", {
								type: itemType,
							})
						}
					}}>
					<Image
						source={FindingItems[itemType]}
						style={{ width: 165 * widthRate, height: 115 * widthRate, resizeMode: "contain" }}
					/>
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderSearchItems = () => {
		return (
			<>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 10 * widthRate,
						width: WIDTH,
					}}>
					{renderFindingItem("FindByAmount")}
					{renderFindingItem("FindByProducts")}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 10 * widthRate,
						paddingTop: 11,
						width: WIDTH,
					}}>
					{renderFindingItem("FindByLocal")}
					{renderFindingItem("FindByPromotion")}
				</View>
			</>
		)
	}

	const renderSimulating = useCallback(() => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingTop: 11,
					paddingHorizontal: 11,
					justifyContent: "center",
					alignItems: "center",
					width: WIDTH,
				}}
				onPress={() => {
					// console.log(`### ${calculateDonationPointsRef}`)
					// calculateDonationPointsRef?.show()
					update("homeScreen", { isCalculateDonationPoints: true })
				}}>
				<AutoHeightImage source={todayRecommandItems} width={WIDTH - 22} />
			</TouchableOpacity>
		)
	}, [widthRate])

	const renderCardbanner = useCallback(() => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingVertical: 10,
					paddingHorizontal: 11,
					alignItems: "center",
					width: WIDTH,
				}}
				onPress={() => {
					const url = "https://request.ilovehome.kr"
					InAppBrowser.openInAppBrowser(url, "프로모션 요청 방법")
				}}>
				<AutoHeightImage source={cardbannerImage} width={WIDTH - 22} />
			</TouchableOpacity>
		)
	}, [widthRate])

	const renderTodayIsDiscovery = useCallback(() => {
		return (
			<View
				style={{
					paddingBottom: 7,
					paddingHorizontal: 11,
					alignItems: "center",
					width: WIDTH,
				}}>
				<AutoHeightImage source={todayIsDiscoveryImage} width={WIDTH - 22} />
			</View>
		)
	}, [widthRate])

	const renderTodayRecommandItems = useCallback(() => {
		return (
			<View
				style={{
					paddingBottom: 7,
					paddingHorizontal: 11,
					alignItems: "center",
					width: WIDTH,
				}}>
				<Image source={todayRecommandItems} style={{ width: 331 * widthRate, height: 42 * widthRate, resizeMode: "contain" }} />
			</View>
		)
	}, [widthRate])

	const renderTodayIsDiscoveryItem = useCallback(
		(itemType: TodayIsDiscoveryItemsType) => {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
					<Image
						source={TodayIsDiscoveryItems[itemType]}
						style={{ width: FindingItemWith, height: 286 * widthRate, resizeMode: "contain" }}
					/>
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderTodayIsDiscoveryItems = () => {
		return (
			<>
				{isLoading && <LoadingView />}
				{isError && <NetworkError />}
				{data?.length !== 0 && (
					<>
						<View
							style={{
								flex: 1,
								alignItems: "center",
								backgroundColor: "#F3F3F3",
							}}>
							<FlatList
								data={products}
								initialNumToRender={15}
								keyExtractor={(item, index) => `${index}_${item.id}`}
								renderItem={({ item }) => renderItem(item)}
								contentInsetAdjustmentBehavior="automatic"
								showsVerticalScrollIndicator={false}
							/>
						</View>
					</>
				)}
			</>
		)
	}

	const getTitle = (title: string) => {
		return title?.length > 20 ? title.substring(0, 20) + "..." : title
	}
	const getDescription = (description: string) => {
		return description?.length > 30 ? description.substring(0, 30) + "..." : description
	}
	const getPrice = (price: number) => {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	const renderProductsItem = useCallback(
		(item: ProductListResponse) => {
			return (
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.push("ProductDetail3", {
							item: item,
						})
					}}>
					<View
						style={{
							width: 165 * widthRate,
							backgroundColor: Color.white,
							borderRadius: 10,
							borderColor: Color.white,
							borderWidth: 1,
							shadowColor: "#000",
							shadowOffset: {
								width: 0,
								height: 1,
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
						}}>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 10,
								paddingTop: 10,
								backgroundColor: Color.white,
								borderColor: Color.white,
								paddingBottom: 5,
								height: 184 * widthRate,
							}}>
							<AutoHeightImage
								style={{ borderRadius: 5 }}
								source={item.main_product_image ? { uri: item.main_product_image } : defaultImage}
								width={150}
							/>
							{item.promotionyn && (
								<Image
									source={promotion_mark}
									style={{
										position: "absolute",
										top: 0,
										bottom: 0,
										left: 0,
										right: 0,
										width: 30,
										height: 30,
										justifyContent: "center",
										alignItems: "center",
									}}
								/>
							)}
						</View>

						<View
							style={{
								flex: 1,
								paddingTop: 5,
								alignItems: "center",
								flexWrap: "wrap",
								backgroundColor: "#F4F4F4",
							}}>
							<View
								style={{
									width: "100%",
									alignItems: "flex-start",
								}}>
								{item.promotionyn ? (
									<View
										style={{
											paddingTop: 5,
											paddingLeft: 10,
											paddingBottom: 5,
										}}>
										<Image
											source={promotion_img}
											style={{
												width: 40,
												height: 12,
											}}
										/>
									</View>
								) : (
									<View
										style={{
											paddingTop: 5,
											paddingLeft: 10,
											paddingBottom: 5,
										}}>
										<Image
											source={normal_img}
											style={{
												width: 40,
												height: 12,
											}}
										/>
									</View>
								)}
							</View>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										fontStyle: "normal",
										color: Color.black,
										fontWeight: "500",
										paddingHorizontal: 10,
										fontSize: 15,
										height: 50,
									}}>
									{getTitle(item.title)}
								</Text>
							</View>
							<View
								style={{
									marginBottom: 10,
									backgroundColor: "#F4F4F4",
									width: 140,
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										color: "#0033B7",
										fontWeight: "700",
										fontSize: 16,
									}}>{`${getPrice(item.price)} P`}</Text>
							</View>
						</View>
						<Divider />
						{item.promotionyn ? (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									paddingVertical: 5,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
									backgroundColor: "#FFDD65",
									height: 26,
								}}>
								<AutoHeightImage source={starbucks_coupon} width={79} />
							</View>
						) : (
							<TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignItems: "center",
										paddingVertical: 5,
										borderBottomLeftRadius: 10,
										borderBottomRightRadius: 10,
										backgroundColor: "#D1D1D1",
										height: 26,
									}}>
									<AutoHeightImage source={request_coupon} width={97} />
								</View>
							</TouchableOpacity>
						)}
					</View>
				</TouchableOpacity>
			)
		},
		[widthRate]
	)

	const renderItem = (item: ProductListRenderItem) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 11,
					paddingTop: 5,
					paddingBottom: 2,
					width: WIDTH,
				}}>
				{item.itemLeft && renderProductsItem(item.itemLeft)}
				{item.itemRight && renderProductsItem(item.itemRight)}
			</View>
		)
	}

	const renderIntroduceGuide = useCallback(() => {
		return (
			<>
				<View
					style={{
						paddingVertical: 15,
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 10 * widthRate,
						width: WIDTH,
					}}>
					{renderIntroduceItem("IntroductionImg")}
					{renderIntroduceItem("CalculateDonationPointsImg")}
				</View>
			</>
		)
	}, [widthRate])

	return (
		<>
			<SearchTopbar />
			<View
				style={{
					flex: 1,
					alignItems: "center",
					backgroundColor: "#F3F3F3",
				}}>
				<ScrollView>
					{renderIntroduceGuide()}
					{renderSearchItems()}
					{/* {renderSimulating()} */}
					{renderCardbanner()}
					{renderTodayIsDiscovery()}
					{renderTodayIsDiscoveryItems()}
					<View style={{ height: 20 }} />
				</ScrollView>
			</View>
		</>
	)
}

export default HomeScreen

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
})
