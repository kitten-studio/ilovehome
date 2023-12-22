import { ProductListResponse, PromotionInfoResponse } from "@main/@types/response"
import { ViewDimension } from "@main/screens/lib/ViewDimension"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import _ from "lodash"
import React, { FC, useEffect, useRef, useState } from "react"
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import AutoHeightWebView from "react-native-autoheight-webview"
import { WebViewNavigationEvent } from "react-native-webview/lib/WebViewTypes"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { countDigits, numberWithCommas } from "../common/StringUtils"
import Divider from "../components/Divider"
import InAppBrowser from "../lib/InAppBrowser"
import PromotionInducementModal, { PromotionInducementModalRef } from "./promotion/PromotionInducementModal"
import PromotionGuideModal, { PromotionGuideModalRef } from "./promotion/PromotionGuideModal"
import { loginStore } from "../lib/account/LoginStore"
import { isLogin } from "../lib/account/LoginUtils"
import api from "../lib/api/api"

const donatingImage = require("@main/static/productdetail/Donating.png")

const WIDTH = ViewDimension.get().width
const donatingWidth = ViewDimension.get().width - 22

const defaultImage = require("@main/static/products/default_image.png")

type ProductImageType = {
	url: string
	width: number
	height: number
}

export type ProductDetailScreenTypeProps = {
	item: ProductListResponse
	fromPromotion?: boolean
}

type ProductDetailScreenProps = NativeStackScreenProps<AppStackParamList, "ProductDetail3"> & ProductDetailScreenTypeProps

const ProductDetailScreen3: FC<ProductDetailScreenProps> = ({ route, navigation }) => {
	const { item, fromPromotion } = route.params
	const [widthRate, setWidthRate] = useState(1)
	const [totalItemPrice, setTotalItemPrice] = useState(0)
	const [itemCounter, setItemCounter] = useState(1)
	const promotionInducementModalRef = useRef<PromotionInducementModalRef>(null)
	const promotionGuideModalRef = useRef<PromotionGuideModalRef>(null)
	const inAppBrowserTitle = ""
	const [promotionInfos, setPromotionInfos] = useState<PromotionInfoResponse[] | undefined>(undefined)

	const getPromotionInfo = async () => {
		const userInfo = await loginStore.getUserInfo(true)
		if (!userInfo) return

		const fetchDataLoading = {
			queryKey: ["product/promotion/info"],
			url: "product/promotion/info",
			data: {
				userId: userInfo?.userId,
			},
		}
		const response = await api.post<PromotionInfoResponse[]>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const data = response.data
		if (!_.isEmpty(data) && response.status === 200) {
			setPromotionInfos(data)
		}
	}

	const getPromotionInfoCheck = (goods_id: string) => {
		const promotionInfo = promotionInfos?.find((item) => item.goods_id === goods_id)

		if (
			item?.goods_id === promotionInfo?.goods_id &&
			(promotionInfo?.status == "create" || promotionInfo?.status == "process" || promotionInfo?.status == "done")
		) {
			return false
		}
		return true
	}

	const getPromotionInfoCheckTitle = (goods_id: string) => {
		const promotionInfo = promotionInfos?.find((item) => item.goods_id === goods_id)
		const status = promotionInfo?.status
		if (status === "create" || status == "process") {
			return "신청 완료"
		}
		if (status === "done") {
			return "지급 완료"
		}
		return "프로모션 신청"
	}

	const getPromotionInfoStatus = (goods_id: string): string | undefined => {
		const promotionInfo = promotionInfos?.find((item) => item.goods_id === goods_id)
		return promotionInfo?.status
	}

	useEffect(() => {
		setWidthRate(WIDTH / 360)
		setTotalItemPrice(item.price * itemCounter)
		StatusBar.setBackgroundColor("#ffffff")
		navigation.addListener("focus", () => {
			getPromotionInfo()
		})
	}, [])

	const getProductImage = (url: string) => {
		const { width, height } = Image.resolveAssetSource({ uri: url })
	}

	const renderDonating = () => {
		return (
			<>
				<View
					style={{
						justifyContent: "space-between",
						flexDirection: "row",
						alignItems: "center",
						width: WIDTH,
						height: 48,
					}}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => {
							if (item.product_external_url) {
								InAppBrowser.openInAppBrowser(item.product_external_url, inAppBrowserTitle)
							} else {
							}
						}}>
						<View
							style={{
								width: WIDTH / 2 - 10,
								height: 43,
								backgroundColor: "#E95400",
								borderRadius: 5,
								justifyContent: "center",
								alignItems: "center",
								marginHorizontal: 5,
							}}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 15,
									color: Color.white,
								}}>
								{"고향사랑e음 가기"}
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => {
							// coupon
							if (item.request_promotionyn && !item.promotionyn) {
								promotionInducementModalRef?.current?.show()
							}
						}}>
						<View
							style={{
								width: WIDTH / 2 - 10,
								height: 43,
								backgroundColor: "#0078BB",
								borderRadius: 5,
								justifyContent: "center",
								alignItems: "center",
								marginHorizontal: 5,
							}}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 15,
									color: Color.white,
								}}>
								{"프로모션 요청"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</>
		)
	}

	const renderDonatingPromotion = () => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingRight: 11,
					paddingLeft: 11,
				}}
				onPress={async () => {
					if (item.request_promotionyn && !item.promotionyn) {
						promotionInducementModalRef?.current?.show()
					} else if (item.promotionyn) {
						if (!getPromotionInfoCheck(item.goods_id)) {
							const status = getPromotionInfoStatus(item.goods_id)
							if (status == "done") {
								Alert.alert(
									"프로모션 완료",
									"프로모션이 승인이 완료 되었습니다.\n\n프로모션을 핸드폰으로 확인 부탁 드립니다."
								)
							} else {
								Alert.alert(
									"프로모션 신청",
									"프로모션 신청 답례품을 고향사랑e음에서 기부포인트로 구입합니다. \n\n답례품 사진 인증만 하면 프로모션 쿠폰을 받을 수 있습니다.\n\n신청내역은 내정보=>프로모션 내역에서 확인 하실수 있습니다.",
									[
										{
											text: "확인",
											onPress: () => {},
										},
										{
											text: "고향사랑e음 가기",
											onPress: () => {
												if (item.product_external_url) {
													InAppBrowser.openInAppBrowser(item.product_external_url, inAppBrowserTitle)
												} else {
												}
											},
										},
									]
								)
							}

							return
						}
						// 먼저 로그인과 화원 등록을 시킨다.
						if (await isLogin(navigation)) {
							const status = getPromotionInfoStatus(item.goods_id)
							if (status === "process") {
								Alert.alert("프로모션 승인중", "프로모션 승인중입니다.\n빠른 시일 내에 진행하겠습니다.", [
									{
										text: "확인",
										onPress: () => {},
									},
								])
							} else {
								promotionGuideModalRef?.current?.show()
							}
						}
					} else {
						if (item.product_external_url) {
							InAppBrowser.openInAppBrowser(item.product_external_url, inAppBrowserTitle)
						} else {
						}
					}
				}}>
				{item.promotionyn && (
					<View
						style={{
							width: WIDTH - 22,
							height: 43,
							backgroundColor: getPromotionInfoCheck(item.goods_id) ? "#E95400" : "#0078BB",
							borderRadius: 5,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 15,
								color: Color.white,
							}}>
							{getPromotionInfoCheckTitle(item.goods_id)}
						</Text>
					</View>
				)}
				{!item.promotionyn && (
					<View
						style={{
							width: WIDTH - 22,
							height: 43,
							backgroundColor: "#0078BB",
							borderRadius: 5,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Text
							style={{
								fontWeight: "700",
								fontSize: 20,
								color: Color.white,
							}}>
							{"프로모션 요청"}
						</Text>
					</View>
				)}
			</TouchableOpacity>
		)
	}

	const getImageThumbnail = (url: string | null) => {
		if (_.isEmpty(url)) return defaultImage
		return {
			uri: url,
		}
	}

	const getHtmlContents = (contents: string) => {
		const html = contents
			.replace(/src="\/thumb\//g, `src="https://shop.ilovegohyang.go.kr/thumb/`)
			.replace(/src="https:\/\/shop\.ilovegohyang.go.kr\/images\/water_mark\.gif" data-src/g, "src")
			.replace(/src="\/images\/water_mark\.gif" data-src/g, "src")
		return html
	}

	const getHtmlContents2 = (contents: string) => {
		const htmlContent = `
					<html>
						<head>
							<style>
								img {
									max-width: 100%;
									height: auto;
								}
							</style>
						</head>
						<body>
						${contents}
						</body>
					</html>
					`
		return htmlContent
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
					<View style={{}}>
						<Text
							style={{
								fontStyle: "normal",
								color: "#0030AD",
								fontWeight: "500",
							}}>
							{item.prefectureName}
						</Text>
					</View>
					<View style={{ flex: 1 }}></View>
				</View>
				<View
					style={{
						paddingTop: 5,
						paddingHorizontal: 12,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
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
							color: Color.black,
							fontWeight: "500",
							fontSize: 18,
						}}>
						{"판매가"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: "#0030AD",
							fontWeight: "600",
							fontSize: 20,
							paddingLeft: 50,
						}}>
						{`${numberWithCommas(item.price)} P`}
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
							fontSize: 15,
						}}>
						{"배송비"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 15,
							paddingLeft: 50,
						}}>
						{item.shipping_cost}
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
							fontSize: 15,
						}}>
						{"원산지"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 15,
							paddingLeft: 50,
						}}>
						{item.origin}
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
							fontSize: 15,
						}}>
						{"제조사"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							fontSize: 15,
							paddingLeft: 50,
						}}>
						{item.manufacturer}
					</Text>
				</View>
				<View
					style={{
						paddingTop: 11,
						paddingHorizontal: 12,
						paddingBottom: 11,
						flexDirection: "row",
					}}></View>
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
							fontWeight: "500",
							fontSize: 18,
						}}>
						{"기부금액"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: "#0030AD",
							fontWeight: "600",
							fontSize: 20,
							paddingLeft: 70,
						}}>
						{`${numberWithCommas(countDigits((item.price * itemCounter * 10) / 3))}원`}
					</Text>
				</View>
			</>
		)
	}

	return (
		<>
			<Topbar title={"답례품 상세페이지"} isLeft={!fromPromotion} isClose={fromPromotion} isHome />
			<ScrollView style={{ backgroundColor: "white" }}>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						paddingTop: 11,
						paddingHorizontal: 12,
					}}>
					<Image
						source={getImageThumbnail(item.main_product_image)}
						style={{ width: WIDTH - 24, height: 360 * widthRate, borderRadius: 5, borderWidth: 1 }}
					/>
				</View>
				{renderProductDetailInfo()}
				{item.product_detail_contents && (
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							paddingTop: 11,
							paddingHorizontal: 12,
						}}>
						<AutoHeightWebView
							style={{ width: WIDTH - 22, marginTop: 35 }}
							automaticallyAdjustContentInsets={false}
							scrollEnabledWithZoomedin={false}
							javaScriptEnabled
							files={[
								{
									href: "cssfileaddress",
									type: "text/css",
									rel: "stylesheet",
								},
							]}
							source={{
								html: getHtmlContents2(item.product_detail_contents),
							}}
							viewportContent={"width=device-width, user-scalable=no"}
							onLoad={(event: WebViewNavigationEvent) => {}}
							onLoadEnd={(event: WebViewNavigationEvent) => {}}
							onLoadStart={(event: WebViewNavigationEvent) => {}}
						/>
					</View>
				)}
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
				{item.promotionyn && renderDonatingPromotion()}
				{!item.promotionyn && renderDonating()}
			</View>
			<PromotionInducementModal
				ref={promotionInducementModalRef}
				goods_id={item.goods_id}
				onNext={() => {
					if (item.product_external_url) {
						InAppBrowser.openInAppBrowser(item.product_external_url, inAppBrowserTitle)
					} else {
					}
				}}
			/>
			<PromotionGuideModal
				ref={promotionGuideModalRef}
				item={item}
				onClose={() => {
					getPromotionInfo()
				}}
				onNext={() => {
					if (item.product_external_url) {
						InAppBrowser.openInAppBrowser(item.product_external_url, inAppBrowserTitle)
					} else {
					}
				}}
			/>
		</>
	)
}

export default ProductDetailScreen3
