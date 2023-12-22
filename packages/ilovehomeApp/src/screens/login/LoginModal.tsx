import { getProfile as getKakaoProfile, login, logout, unlink } from "@react-native-seoul/kakao-login"
import React, { FC, useEffect, useState } from "react"
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native"

import { AppStackParamList } from "@main/@types/params"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import { loginStore } from "../lib/account/LoginStore"
import { loginService } from "../lib/account/LoginStore/Service"

interface LoginModalProps {}

const LoginModal: FC<LoginModalProps> = () => {
	const [result, setResult] = useState<string>("")
	const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

	useEffect(() => {
		navigation.setOptions({
			header: () => null,
			headerStyle: {
				elevation: 0,
				backgroundColor: "#ffffff",
				position: "absolute",
				zIndex: 100,
				top: 0,
				left: 0,
				right: 0,
			},
		})
		StatusBar.setBackgroundColor("#ffffff")
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
			navigation.goBack()
		} catch (err) {
			console.error("login err", err)
		}
	}

	const signOutWithKakao = async (): Promise<void> => {
		try {
			const message = await logout()

			setResult(message)
		} catch (err) {
			console.error("signOut error", err)
		}
	}

	const getProfile = async (): Promise<void> => {
		try {
			const profile = await getKakaoProfile()
			setResult(JSON.stringify(profile))
		} catch (err) {
			console.error("signOut error", err)
		}
	}

	const unlinkKakao = async (): Promise<void> => {
		try {
			const message = await unlink()

			setResult(message)
		} catch (err) {
			console.error("signOut error", err)
		}
	}

	return (
		<>
			<Topbar title={"로그인"} isClose />
			<View style={styles.container}>
				<Text>{result}</Text>
				<Pressable
					style={styles.button}
					onPress={() => {
						signInWithKakao()
					}}>
					<Text style={styles.text}>카카오 로그인</Text>
				</Pressable>
				<Pressable style={styles.button} onPress={() => getProfile()}>
					<Text style={styles.text}>프로필 조회</Text>
				</Pressable>
				<Pressable style={styles.button} onPress={() => unlinkKakao()}>
					<Text style={styles.text}>링크 해제</Text>
				</Pressable>
				<Pressable style={styles.button} onPress={() => signOutWithKakao()}>
					<Text style={styles.text}>카카오 로그아웃</Text>
				</Pressable>
			</View>
		</>
	)
}

export default LoginModal

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingBottom: 100,
	},
	button: {
		backgroundColor: "#FEE500",
		borderRadius: 40,
		borderWidth: 1,
		width: 250,
		height: 40,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginTop: 10,
	},
	text: {
		textAlign: "center",
	},
})
