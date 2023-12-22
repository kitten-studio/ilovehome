import { AppStackParamList } from "@main/@types/params"
import { ProductListResponse, PromotionRequestResponse } from "@main/@types/response"
import { Color } from "@main/screens/common/Color"
import Divider from "@main/screens/components/Divider"
import Topbar from "@main/screens/components/Topbar"
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

export interface PromotionInducementModalRef {
	show: () => void
	hide: () => void
}

type PromotionInducementModalProps = {
	onNext?: () => void
	goods_id?: string
}

const PromotionInducementModal = forwardRef<PromotionInducementModalRef, PromotionInducementModalProps>((props, ref) => {
	const { onNext, goods_id } = props
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
	const [isVisible, setIsVisible] = useState(false)
	const [request_promotion_count, setRequestPromotionCount] = useState(0)
	const [request_promotion_max, setRequestPromotionMax] = useState(0)
	const show = useCallback(() => {
		setIsVisible(true)
	}, [])
	const hide = useCallback(() => setIsVisible(false), [])
	const [item, setItem] = useState<ProductListResponse>()

	useImperativeHandle(ref, () => ({
		show,
		hide,
	}))

	const fetchDataLoading = {
		queryKey: ["product/promotion/refresh"],
		url: "product/promotion/refresh",
		data: {
			goods_id,
		},
	}

	useEffect(() => {
		if (isVisible) {
			const run = async () => {
				const response = await api.post<ProductListResponse>(
					`${process.env.API_HOST}/${fetchDataLoading.url}`,
					fetchDataLoading.data
				)
				const data = response.data
				if (!_.isEmpty(data) && response.status === 200) {
					setItem(data[0])
					setRequestPromotionCount(data[0].request_promotion_count)
					setRequestPromotionMax(data[0].request_promotion_max)
				}
			}
			run()
		}
	}, [isVisible])

	const requestPromotionButton = () => {
		const run = async () => {
			if (request_promotion_max <= request_promotion_count) {
				Alert.alert("프로모션 대상", "이미 프로모션 대상 답례품 입니다. \n홈 => 프로모션 카테고리에서 확인 해주세요", [
					{
						text: "확인",
						onPress: () => {
							hide()
						},
					},
				])
				return
			}

			const userInfo = await loginStore.getUserInfo(true)
			const userId = userInfo?.userId

			if (_.isEmpty(userId)) {
				hide()
				navigation.push("ProviderLoginModal", { isRegister: false })
				return
			}

			const response = await api.post<PromotionRequestResponse>(`${process.env.API_HOST}/${`product/promotion/request`}`, {
				goods_id,
				userId,
			})
			const data = response.data
			if (!_.isEmpty(data) && response.status === 200) {
				if (data.promotionServey === "ok") {
					console.log(`### `, data)

					Alert.alert("요청 버튼을 누른 당신, 축하합니다!", "이미 프로모션 요청을 하였습니다!", [
						{
							text: "확인",
							onPress: () => {
								hide()
							},
						},
					])
					return
				}
				setRequestPromotionCount(data.request_promotion_count)
				Alert.alert("요청 버튼을 누른 당신, 축하합니다!", "특별한 스타벅스 쿠폰 정보가 다른 사람 보다 먼저 도착합니다!", [
					{
						text: "확인",
						onPress: () => {},
					},
				])
			} else {
			}
		}
		run()
	}

	const handleBackButtonClick = () => {
		hide()
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
							{`스타벅스 쿠폰 받기를 원하시면 요청버튼을 눌러주세요.`}
						</Text>
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
							{`${item?.request_promotion_max ?? 0} 명까지 ${request_promotion_count ?? 0} 명이 요청하였습니다.`}
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
						<TouchableOpacity activeOpacity={0.5} style={{}} onPress={requestPromotionButton}>
							<View
								style={{
									width: WIDTH - 10,
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
									{"프로모션 요청하기"}
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

export default PromotionInducementModal
