import React, { FC, useEffect, useRef, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity, BackHandler, Alert } from "react-native"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import { ViewDimension } from "@main/screens/lib/ViewDimension"
import AutoHeightImage from "react-native-auto-height-image"
import Swiper from "react-native-swiper"
import { login } from "@react-native-seoul/kakao-login"
import { loginService } from "@main/screens/lib/account/LoginStore/Service"
import { loginStore } from "@main/screens/lib/account/LoginStore"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"
import { AppStackParamList } from "@main/@types/params"
import { StackScreenProps } from "@react-navigation/stack"

const WIDTH = ViewDimension.get().width
const HEIGHT = ViewDimension.get().height

const kakaoLoginImg = require("@main/static/tutorial/kakao_login_img.png")
const kakaoLoginDisableImg = require("@main/static/tutorial/kakao_login_img_disable.png")
const GohyangPlusTutorial01Img = require("@main/static/tutorial/GohyangPlusTutorial01.png")
const GohyangPlusTutorial02Img = require("@main/static/tutorial/GohyangPlusTutorial02.png")
const GohyangPlusTutorial03Img = require("@main/static/tutorial/GohyangPlusTutorial03.png")
const GohyangPlusTutorial04Img = require("@main/static/tutorial/GohyangPlusTutorial04.png")

export type GohyangPlusTutorialProps = {
	onClose?: () => void
}

type GohyangPlusTutorialScreenProps = StackScreenProps<AppStackParamList, "GohyangPlusTutorial"> & GohyangPlusTutorialProps

const GohyangPlusTutorialScreen: FC<GohyangPlusTutorialScreenProps> = ({ route }) => {
	const [widthRate, setWidthRate] = useState(1)
	const [disabledKakao, setDisableKakao] = useState(false)
	const [indexChanged, setIndexChanged] = useState(0)
	const navigation = useNavigation()

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")

		setWidthRate(WIDTH / 360)
		setTimeout(() => {
			setDisableKakao(true)
		}, 4000)
	}, [])

	useEffect(() => {
		const onBackPress = () => {
			return true
		}

		const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

		return () => subscription.remove()
	}, [])

	const signInWithKakao = async (): Promise<void> => {
		try {
			const token = await login()
			const response = await loginService.loginWithKakao(token.accessToken)
			loginStore.setAuthInfo({
				access_token: response.access_token,
				refresh_token: response.refresh_token,
			})
			loginStore.setUserInfo({ userId: response.userId })
			StorageManager.getInstance().set(Constants.LOCAL_USER_FIRST_LOGIN, "true")
			route.params?.onClose?.()
			navigation.goBack()
		} catch (err) {
			console.error("login err", err)
			Alert.alert("", "로그인 에러 발생! 다시 시도해 주세요")
		}
	}

	const renderPagination = (index, total, context) => {
		return (
			<View
				style={{
					position: "absolute",
					justifyContent: "center",
					alignItems: "center",
					top: 25,
					left: 0,
					right: 0,
				}}>
				<View
					style={{
						borderRadius: 7,
						backgroundColor: "rgba(255,255,255,.15)",
						padding: 3,
						paddingHorizontal: 7,
					}}>
					<Text
						style={{
							color: "#fff",
							fontSize: 14,
						}}>
						{index + 1} / {total}
					</Text>
				</View>
			</View>
		)
	}

	return (
		<>
			<View style={styles.container}>
				<Swiper
					dot={
						<View
							style={{
								backgroundColor: "#D1D1D1",
								width: 9,
								height: 9,
								borderRadius: 5,
								marginLeft: 7,
								marginRight: 7,
							}}
						/>
					}
					activeDot={
						<View
							style={{
								backgroundColor: "#54F394",
								width: 9,
								height: 9,
								borderRadius: 5,
								marginLeft: 7,
								marginRight: 7,
							}}
						/>
					}
					paginationStyle={{
						bottom: 70,
					}}
					showsPagination={true}
					autoplay={true}
					autoplayTimeout={2}
					loop={false}>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AutoHeightImage source={GohyangPlusTutorial01Img} width={WIDTH - 10} />
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AutoHeightImage source={GohyangPlusTutorial02Img} width={WIDTH - 10} />
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AutoHeightImage source={GohyangPlusTutorial03Img} width={WIDTH - 10} />
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<AutoHeightImage source={GohyangPlusTutorial04Img} width={WIDTH - 10} />
					</View>
				</Swiper>
			</View>
			<View
				style={{
					height: 100,
					width: "100%",
					backgroundColor: "#fff",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<TouchableOpacity
					activeOpacity={0.5}
					disabled={!disabledKakao}
					onPress={() => {
						signInWithKakao()
					}}>
					<Image
						source={disabledKakao ? kakaoLoginImg : kakaoLoginDisableImg}
						style={{ width: 263 * widthRate, height: 39 * widthRate, resizeMode: "contain" }}
					/>
				</TouchableOpacity>
			</View>
		</>
	)
}

export default GohyangPlusTutorialScreen

const styles = {
	wrapper: {},

	slide: {
		flex: 1,
		backgroundColor: "transparent",
	},
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},

	imgBackground: {
		WIDTH,
		HEIGHT,
		backgroundColor: "transparent",
		position: "absolute",
	},

	image: {
		WIDTH,
		HEIGHT,
	},
}
