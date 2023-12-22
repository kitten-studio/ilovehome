import { AppStackParamList } from "@main/@types/params"
import { ProductListResponse, PromotionInfoResponse } from "@main/@types/response"
import { Color } from "@main/screens/common/Color"
import Divider from "@main/screens/components/Divider"
import Topbar from "@main/screens/components/Topbar"
import InAppBrowser from "@main/screens/lib/InAppBrowser"
import { ViewDimension } from "@main/screens/lib/ViewDimension"
import { loginStore } from "@main/screens/lib/account/LoginStore"
import api from "@main/screens/lib/api/api"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import _ from "lodash"
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { Alert, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AutoHeightImage from "react-native-auto-height-image"

const WIDTH = ViewDimension.get().width

const promotion_starbucksImg = require("@main/static/promotion/promotion_starbucks.png")

type PromotionInfoCreate = PromotionInfoResponse

export interface PromotionGuideModalRef {
	show: () => void
	hide: () => void
}

type PromotionGuideModalProps = {
	onNext?: () => void
	onClose?: () => void
	item?: ProductListResponse
}

const PromotionGuideModal = forwardRef<PromotionGuideModalRef, PromotionGuideModalProps>((props, ref) => {
	const { onNext, onClose, item } = props
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
	const [isVisible, setIsVisible] = useState(false)
	const [request_promotion_count, setRequestPromotionCount] = useState(0)
	const show = useCallback(() => {
		setIsVisible(true)
	}, [])
	const hide = useCallback(() => setIsVisible(false), [])
	const [promotionInfo, setPromotionInfo] = useState<PromotionInfoResponse | undefined>(undefined)

	useImperativeHandle(ref, () => ({
		show,
		hide,
	}))

	useEffect(() => {
		if (isVisible) {
			const run = async () => {
				const userInfo = await loginStore.getUserInfo(true)
				if (!userInfo) return
				// console.log(`### userInfo?.userId ${userInfo?.userId}`)
				const fetchDataLoading = {
					queryKey: ["product/promotion/info"],
					url: "product/promotion/info",
					data: {
						userId: userInfo?.userId,
					},
				}

				const response = await api.post<PromotionInfoResponse>(
					`${process.env.API_HOST}/${fetchDataLoading.url}`,
					fetchDataLoading.data
				)
				const data = response.data
				if (!_.isEmpty(data) && response.status === 200) {
					setPromotionInfo(data)
				}
			}
			run()
		}
	}, [isVisible])

	const goToExternalUrl = () => {
		if (item?.product_external_url) {
			InAppBrowser.openInAppBrowser(item.product_external_url, "")
		}
	}

	const requestCreateButton = () => {
		const run = async () => {
			const userInfo = await loginStore.getUserInfo(true)
			if (!userInfo) return
			if (item?.goods_id === promotionInfo?.goods_id && promotionInfo?.status == "create") {
				Alert.alert(
					"프로모션 신청",
					"프로모션 신청 답례품을 고향사랑e음에서 기부포인트로 구입합니다. \n\n답례품 사진 인증만 하면 프로모션 쿠폰을 받을 수 있습니다.\n\n내정보=>프로모션 내역에서 확인 하실수 있습니다.",
					[
						{
							text: "확인",
							onPress: () => {},
						},
					]
				)
				return
			}

			const fetchDataLoading = {
				queryKey: ["product/promotion/create"],
				url: "product/promotion/create",
				data: {
					userId: userInfo?.userId,
					goods_id: item?.goods_id,
					phoneNumber: userInfo?.phoneNumber ?? "",
					userName: userInfo?.name,
				},
			}

			const response = await api.post<PromotionInfoCreate>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
			const data = response.data
			if (!_.isEmpty(data) && response.status === 200) {
				setPromotionInfo(data)
				Alert.alert(
					"프로모션 신청",
					"프로모션 신청이 완료 되었습니다. \n\n프로모션 신청 답례품을 고향사랑e음에서 기부포인트로 구입합니다. \n\n답례품 사진 인증만 하면 프로모션 쿠폰을 받을 수 있습니다.",
					[
						{
							text: "확인",
							onPress: () => {
								// goToExternalUrl()
							},
						},
					]
				)
			}
		}
		run()
	}

	const handleBackButtonClick = () => {
		hide()
		onClose?.()
		return true
	}

	return (
		<Modal visible={isVisible} animationType="slide" transparent onRequestClose={handleBackButtonClick}>
			<View style={styles.container}>
				<StatusBar backgroundColor="#fff" translucent={false} />
				<View style={styles.modal}>
					<Topbar
						title={"답례품으로 프로모션 신청"}
						isClose
						onClose={() => {
							hide()
							onClose?.()
						}}
					/>
					<Divider />
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.black,
								fontWeight: "700",
								paddingBottom: 10,
								paddingTop: 10,
								paddingHorizontal: 50,
								fontSize: 18,
							}}>
							{"당신의 원클릭, 스타벅스 쿠폰으로 만나보세요!"}
						</Text>
						<AutoHeightImage source={promotion_starbucksImg} width={252} />
						<Text
							style={{
								fontStyle: "normal",
								color: Color.black,
								fontWeight: "700",
								paddingBottom: 10,
								paddingTop: 10,
								paddingHorizontal: 50,
								fontSize: 18,
							}}>
							{`답례품과 함께 스타벅스에서 즐기는 커피 한 잔의 기회, 지금 바로 잡으세요!`}
						</Text>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.black,
								fontWeight: "500",
								paddingBottom: 10,
								paddingTop: 10,
								paddingHorizontal: 50,
								fontSize: 12,
							}}>
							{`* 수량 한정, 지금 바로 특별 혜택을 누려보세요!`}
						</Text>
					</View>
					<Divider />
					<View style={styles.fixToText}>
						<TouchableOpacity
							activeOpacity={0.5}
							style={{}}
							onPress={() => {
								onNext?.()
								hide()
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
									marginBottom: 10,
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
						<TouchableOpacity activeOpacity={0.5} style={{}} onPress={requestCreateButton}>
							<View
								style={{
									width: WIDTH / 2 - 10,
									height: 43,
									backgroundColor: "#0078BB",
									borderRadius: 5,
									justifyContent: "center",
									alignItems: "center",
									marginHorizontal: 5,
									marginBottom: 10,
								}}>
								<Text
									style={{
										fontWeight: "500",
										fontSize: 15,
										color: Color.white,
									}}>
									{item?.goods_id === promotionInfo?.goods_id && promotionInfo?.status == "create"
										? "신청 완료"
										: "지금 신청 하기"}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	modal: {
		backgroundColor: "#fff",
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	message: {
		fontSize: 16,
		marginBottom: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	cancel: {
		fontSize: 16,
		color: "gray",
		marginRight: 10,
	},
	accept: {
		fontSize: 16,
		color: "blue",
	},
	fixToText: {
		paddingTop: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
})

export default PromotionGuideModal
