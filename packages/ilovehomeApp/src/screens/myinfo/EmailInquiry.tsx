import { AppStackParamList } from "@main/@types/params"
import { CommonActions } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { FC, useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import Divider from "../components/Divider"
import Topbar from "../components/Topbar"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import { Color } from "../common/Color"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { ScrollView } from "react-native-gesture-handler"

export type EmailInquiryTypeProps = {}

type EmailInquiryScreenProps = NativeStackScreenProps<AppStackParamList, "EmailInquiry"> & EmailInquiryTypeProps

const EmailInquiry: FC<EmailInquiryScreenProps> = ({ route, navigation }) => {
	const [userInfo, setUserInfo] = useState(route.params?.userInfo)
	const [addressDetail, setAddressDetail] = useState("")
	const [isCheckBoxView, setIsCheckBoxView] = useState(true)
	const [isChecked, setIsChecked] = useState(false)
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// Screen was focused
			StatusBar.setBackgroundColor("#FFFFFF")
			StatusBar.setBarStyle("dark-content")
			const run = async () => {
				const userInfo = await loginStore.getUserInfo()
				if (!userInfo) return
				setUserInfo(userInfo)
				if (userInfo.isRegistered) {
					setIsCheckBoxView(false)
				}
			}
			run()
		})

		return unsubscribe
	}, [])

	const renderCallCustomerSupport = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 30,
							color: "black",
						}}>
						{"이름"}
					</Text>
					<View style={{ flex: 1 }} />
					<TextInput
						style={{
							minHeight: 40,
							width: 250,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D1D1D1", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							marginTop: 10,
							marginBottom: 10,
							marginRight: 10,
							padding: 10, // 입력 창 내부 여백
						}}
						placeholder=""
						value={addressDetail}
						onChangeText={(val) => {
							setAddressDetail(val)
						}}
						maxLength={100}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>
			</>
		)
	}, [])

	const renderEmail = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 30,
							color: "black",
						}}>
						{"이메일"}
					</Text>
					<View style={{ flex: 1 }} />
					<TextInput
						style={{
							minHeight: 40,
							width: 250,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D1D1D1", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							marginTop: 10,
							marginBottom: 10,
							marginRight: 10,
							padding: 10, // 입력 창 내부 여백
						}}
						placeholder=""
						value={addressDetail}
						onChangeText={(val) => {
							setAddressDetail(val)
						}}
						maxLength={100}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>
			</>
		)
	}, [])

	const renderTitle = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 30,
							color: "black",
						}}>
						{"제목"}
					</Text>
					<View style={{ flex: 1 }} />
					<TextInput
						style={{
							minHeight: 40,
							width: 250,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D1D1D1", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							marginTop: 10,
							marginBottom: 10,
							marginRight: 10,
							padding: 10, // 입력 창 내부 여백
						}}
						placeholder=""
						value={addressDetail}
						onChangeText={(val) => {
							setAddressDetail(val)
						}}
						maxLength={100}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>
			</>
		)
	}, [])

	const renderContents = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 300,
						flexDirection: "row",
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 30,
							paddingTop: 20,
							color: "black",
						}}>
						{"문의내용"}
					</Text>
					<View style={{ flex: 1 }} />
					<TextInput
						style={{
							minHeight: 300,
							width: 250,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D1D1D1", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							marginTop: 10,
							marginBottom: 10,
							marginRight: 10,
							padding: 10, // 입력 창 내부 여백
						}}
						multiline={true}
						textAlignVertical="top"
						placeholder=""
						maxLength={100}
						keyboardType="default"
						autoCapitalize="none"
					/>
				</View>
			</>
		)
	}, [])

	const handleCheckboxChange = (checked) => {
		setIsChecked(checked)
	}

	const renderAgreeToTerms = useCallback(() => {
		return (
			<>
				<View
					style={{
						height: 50,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginTop: 20,
					}}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 16,
							paddingLeft: 30,
							color: "black",
						}}>
						{"이용약관"}
					</Text>
					<View style={{ flex: 1 }} />
					<View style={{ width: 250, justifyContent: "flex-end", flexDirection: "row" }}>
						<BouncyCheckbox
							size={20}
							fillColor="blue"
							unfillColor="#FFFFFF"
							innerIconStyle={{ borderWidth: 2 }}
							onPress={(isChecked: boolean) => {
								setIsChecked(isChecked)
							}}
						/>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingRight: 10,
								color: "black",
							}}>
							{"개인정보 수집 및 이용 동의"}
						</Text>
					</View>
				</View>
				<View
					style={{
						height: 25,
						flexDirection: "row",
					}}>
					<View style={{ flex: 1 }} />
					<TouchableOpacity
						onPress={() => {
							const url =
								"https://ilovehome-s3-bucket.s3.ap-northeast-2.amazonaws.com/TermsAndPolicy/PersonalDataCollection.html"
							navigation.push("Webview", { title: "개인정보 수집 및 이용", url })
						}}>
						<View style={{ width: 250, justifyContent: "flex-end", flexDirection: "row" }}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 10,
									paddingLeft: 10,
									paddingRight: 10,
									color: "black",
									textDecorationLine: "underline",
								}}>
								{"개인정보 수집 및 이용 동의 내용보기"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</>
		)
	}, [])

	const renderConfirm = () => {
		return (
			<View style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 20, backgroundColor: "#ffffff" }}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						paddingRight: 5,
						paddingLeft: 5,
						paddingTop: 20,
					}}
					onPress={() => {}}>
					<View
						style={{
							backgroundColor: "#0078BB",
							justifyContent: "center",
							alignItems: "center",
							paddingTop: 15,
							paddingBottom: 15,
							borderRadius: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								fontWeight: "600",
								color: Color.white,
								fontSize: 15,
							}}>
							확인
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<>
			<Topbar title={"이메일 문의"} isLeft />
			<Divider />
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: "#ffffff",
				}}>
				<View style={{ marginTop: 20 }} />
				{renderCallCustomerSupport()}
				{renderEmail()}
				{renderTitle()}
				{renderContents()}
				{renderAgreeToTerms()}
			</ScrollView>
			{renderConfirm()}
		</>
	)
}

export default EmailInquiry
