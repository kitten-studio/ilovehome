import { ProductListResponse, PromotionInfoResponse } from "@main/@types/response"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import _ from "lodash"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { AppStackParamList } from "../../@types/params"
import { Color } from "../common/Color"
import { LoadingView } from "../components/LoadingView"
import { NetworkError } from "../components/NetworkError"
import Topbar from "../components/Topbar"
import { useDataLoading, useDataLoadingWith } from "../hooks/useDataLoading"
import { ViewDimension } from "../lib/ViewDimension"
import { StackScreenProps } from "@react-navigation/stack"
import AutoHeightImage from "react-native-auto-height-image"
import OutlineButton from "../lib/uix/components/OutlineButton"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { check, request, PERMISSIONS } from "react-native-permissions"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import storage from "@react-native-firebase/storage"
import { loginStore } from "../lib/account/LoginStore"
import api from "../lib/api/api"

const WIDTH = ViewDimension.get().width

type ImageInfo = {
	height: number
	width: number
	type: string
	fileName: string
	fileSize: number
	uri: string
}

type PhotoProductVerifierType = StackScreenProps<AppStackParamList, "PhotoProductVerifier"> & {
	item: ProductListResponse
	onClose?: () => void
}

const PhotoProductVerifier: FC<PhotoProductVerifierType> = ({ navigation, route }) => {
	const [addImageBottomSheetVisible, setAddImageBottomSheetVisible] = useState(true)
	const [response, setResponse] = React.useState<PromotionInfoResponse | null>(null)
	const [result, setResult] = React.useState<any>(null)
	const [isLoading, setLoading] = useState(false)
	const [isCompelete, setCompelete] = useState(false)
	const bottomSheetRef = useRef<BottomSheet>(null)

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
			const item = data?.find((item) => item.goods_id === route.params?.item.goods_id)
			if (item) {
				setResponse(item)
			}
		}
	}

	useEffect(() => {
		const run = () => {
			getPromotionInfo()
		}
		run()
		bottomSheetRef.current?.close()
	}, [])

	const openAddImageBottomSheet = () => {
		bottomSheetRef.current?.expand()
	}

	const closeAddImageBottomSheet = useCallback(() => {
		route.params?.onClose?.()
		bottomSheetRef.current?.close()
	}, [])

	const getImage = useCallback(async (type: "library" | "capture") => {
		if (type === "capture") {
			const status = await check(PERMISSIONS.ANDROID.CAMERA)
			if (status !== "granted") {
				await request(PERMISSIONS.ANDROID.CAMERA)
			}
		}
		setCompelete(false)
		try {
			if (type === "capture") {
				const result = await launchCamera({
					mediaType: "photo",
					includeBase64: true,
				})
				if (result?.assets) {
					const image = result?.assets[0] as ImageInfo
					const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1)
					setLoading(true)
					try {
						await storage().ref(`images/${filename}`).putFile(image.uri)
						const url = await storage().ref(`images/${filename}`).getDownloadURL()
						uploadImage(url)
					} catch (e) {}
				}
				setResult(result)
			} else {
				const result = await launchImageLibrary({
					mediaType: "photo",
					includeBase64: false,
					selectionLimit: 1,
				})
				if (result?.assets) {
					const image = result?.assets[0] as ImageInfo
					const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1)
					setLoading(true)
					try {
						await storage().ref(`images/${filename}`).putFile(image.uri)
						const url = await storage().ref(`images/${filename}`).getDownloadURL()
						uploadImage(url)
					} catch (e) {}
				}
				setResult(result)
			}
		} catch (e) {}
	}, [])

	const snapPoints = useMemo(() => ["30%"], [])
	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0} // 이거 추가
				disappearsOnIndex={-1} // 이거 추가
				pressBehavior="close"
			/>
		),
		[]
	)

	const uploadImage = async (imageUrl: string) => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return
		const item = route.params?.item
		const fetchDataLoading = {
			queryKey: ["product/promotion/update"],
			url: "product/promotion/update",
			data: {
				userId: userInfo?.userId,
				goods_id: item.goods_id,
				imageUrl,
				phoneNumber: userInfo?.phoneNumber ?? "",
				userName: userInfo?.name,
			},
		}

		const response = await api.post<PromotionInfoResponse>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)

		const data = response.data
		if (!_.isEmpty(data) && response.status === 200) {
			setResponse(data)
			setCompelete(true)
		}
		setLoading(false)
	}

	return (
		<>
			<Topbar title={"답례품 사진 업로드"} isClose />
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						alignItems: "flex-start",
						paddingTop: 10,
					}}>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "700",
							fontSize: 20,
							paddingHorizontal: 12,
						}}>
						{"사진 업로드"}
					</Text>
					<Text
						style={{
							fontStyle: "normal",
							color: Color.black,
							fontWeight: "500",
							paddingTop: 10,
							paddingHorizontal: 12,
						}}>
						{"*중요* 반드시 답례품 박스에 주소가 보이는 형태로 사진을 찍어서 올려 주세요."}
					</Text>
					{response?.imageUrl && (
						<View
							key={response?.imageUrl}
							style={{
								marginVertical: 24,
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: 10,
							}}>
							<Image
								resizeMode="cover"
								resizeMethod="scale"
								style={{
									width: WIDTH - 20,
									height: WIDTH - 20,
								}}
								source={{ uri: response?.imageUrl }}
							/>
						</View>
					)}

					<View style={{ width: "100%", paddingVertical: 10, paddingHorizontal: 12 }}>
						<OutlineButton
							title={isCompelete ? "확인" : "사진 업로드"}
							onPress={() => {
								if (isCompelete) {
									Alert.alert("프로모션 승인중", "프로모션이 승인 중입니다. \n빠른 시일 내에 진행하겠습니다.", [
										{
											text: "확인",
											onPress: () => {
												navigation.goBack()
											},
										},
									])
								} else {
									openAddImageBottomSheet()
								}
							}}
						/>
					</View>
				</View>
			</View>
			{isLoading && (
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			)}
			<>
				<BottomSheet
					ref={bottomSheetRef}
					onClose={() => {
						closeAddImageBottomSheet()
					}}
					enableOverDrag={true}
					enablePanDownToClose={true}
					index={0}
					snapPoints={snapPoints}
					backdropComponent={renderBackdrop}>
					<View style={styles.contentContainer}>
						<View style={{ alignItems: "center", paddingTop: 10 }}>
							<Text
								style={{
									fontStyle: "normal",
									color: Color.black,
									fontWeight: "700",
									fontSize: 15,
								}}>
								{"사진 업로드"}
							</Text>
						</View>
						<View
							style={{
								flex: 1,
								width: "100%",
								alignItems: "flex-start",
								paddingHorizontal: 12,
								paddingTop: 10,
							}}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => {
									getImage("capture")
									closeAddImageBottomSheet()
								}}>
								<Text
									style={{
										fontStyle: "normal",
										color: Color.black,
										fontWeight: "500",
										paddingTop: 10,
										fontSize: 15,
									}}>
									{"카메라로 촬영하기"}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => {
									getImage("library")
									closeAddImageBottomSheet()
								}}>
								<Text
									style={{
										fontStyle: "normal",
										color: Color.black,
										fontWeight: "500",
										paddingTop: 20,
										fontSize: 15,
									}}>
									{"앨범에서 가져오기"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</BottomSheet>
			</>
		</>
	)
}

export default PhotoProductVerifier

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
})
