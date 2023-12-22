import { AppStackParamList } from "@main/@types/params"
import { login } from "@react-native-seoul/kakao-login"
import { StackScreenProps } from "@react-navigation/stack"
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { loginStore } from "../lib/account/LoginStore"
import { loginService } from "../lib/account/LoginStore/Service"
import { ViewDimension } from "../lib/ViewDimension"

export type ProviderLoginModalTypeProps =
	| {
			isRegister?: boolean
	  }
	| undefined
type ProviderLoginModalProps = StackScreenProps<AppStackParamList, "ProviderLoginModal"> & ProviderLoginModalTypeProps

const kakaoLoginImg = require("@main/static/tutorial/kakao_login_img.png")
const WIDTH = ViewDimension.get().width

const ProviderLoginModal: FC<ProviderLoginModalProps> = (props) => {
	const [widthRate, setWidthRate] = useState(1)
	const { navigation, route } = props
	const [result, setResult] = useState<string>("")

	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
		setWidthRate(WIDTH / 360)
	})

	const signInWithKakao = async (): Promise<void> => {
		try {
			const token = await login()
			const response = await loginService.loginWithKakao(token.accessToken)
			setResult(JSON.stringify(token))
			loginStore.setAuthInfo({
				access_token: response.access_token,
				refresh_token: response.refresh_token,
			})
			loginStore.setUserInfo({ userId: response.userId })
			if (route.params?.isRegister) {
				const userInfo = await loginStore.getUserInfo(true)
				if (!_.isEmpty(userInfo)) {
					if (!userInfo?.isRegistered) {
						navigation.goBack()
						navigation.push("UserRegisterModal")
						return
					}
				}
				navigation.goBack()
			} else {
				navigation.goBack()
			}
		} catch (err) {
			console.error("login err", err)
		}
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						signInWithKakao()
					}}>
					<Image source={kakaoLoginImg} style={{ width: 263 * widthRate, height: 39 * widthRate, resizeMode: "contain" }} />
				</TouchableOpacity>
			</View>
		</>
	)
}

export default ProviderLoginModal

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 100,
	},
	button: {
		backgroundColor: "#FEE500",
		borderRadius: 10,
		borderWidth: 1,
		width: 300,
		height: 40,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginTop: 10,
	},
	text: {
		textAlign: "center",
	},
})
