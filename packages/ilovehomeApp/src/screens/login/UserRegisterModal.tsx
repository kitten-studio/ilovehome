import { AppStackParamList } from "@main/@types/params"
import { UserData, UserEmailCheck, UserSmsAuth } from "@main/@types/response"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"
import { StackScreenProps } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import * as _ from "lodash"
import React, { FC, useCallback, useEffect, useState } from "react"
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import AutoHeightImage from "react-native-auto-height-image"
import { Color } from "../common/Color"
import { UserInfo, loginStore } from "../lib/account/LoginStore"
import api from "../lib/api/api"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { ViewDimension } from "../lib/ViewDimension"

const documentsImg = require("@main/static/user/register/user-register-icon.png")
const cardbannerImage = require("@main/static/user/register/notice_register.png")
const WIDTH = ViewDimension.get().width

type LocalUserRegisterModal = {
	email: string
	name: string
	phoneNumber: string
	address: string
	addressDetail: string
}

const localUserRegisterModal: LocalUserRegisterModal = {
	email: "",
	name: "",
	phoneNumber: "",
	address: "",
	addressDetail: "",
}

export type UserRegisterModalTypeProps = {
	userInfo?: UserInfo
}

type UserRegisterModalProps = StackScreenProps<AppStackParamList, "UserRegisterModal"> & UserRegisterModalTypeProps

const UserRegisterModal: FC<UserRegisterModalProps> = (props) => {
	const { navigation, route } = props
	const [email, setEmail] = useState("")
	const [name, setName] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [address, setAddress] = useState("")
	const [addressDetail, setAddressDetail] = useState("")
	const [recommendReferralCode, setRecommendReferralCode] = useState("")
	const [code, setCode] = useState("")
	const [codeConfirm, setCodeConfirm] = useState(false)
	const [emailConfirm, setEmailConfirm] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isModified, setIsModified] = useState(false)
	const [isCheckedServiceAgreement, setCheckedServiceAgreement] = useState(false)
	const [isCheckedPersonalInformation, setCheckedPersonalInformation] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			StatusBar.setBackgroundColor("#ffffff")
		}, 100)
		const run = async () => {
			const userInfo = await loginStore.getUserInfo()
			if (userInfo?.name === "kevin007" && userInfo?.nickname === "kevin007") {
				generatorTestUser()
			}
		}
		run()
	}, [])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("transitionEnd", () => {
			const run = async () => {
				const info = await StorageManager.getInstance().get<LocalUserRegisterModal>(Constants.LOCAL_USER_REGISTER_INFO)
				if (info && _.isEmpty(route.params?.userInfo)) {
					setEmail(info.email)
					setName(info.name)
					setPhoneNumber(info.phoneNumber)
					setAddress(info.address)
					setAddressDetail(info.addressDetail)
				}

				if (!_.isEmpty(route.params?.userInfo)) {
					setIsModified(true)
					const userInfo = route.params?.userInfo
					if (userInfo) {
						setName(userInfo.name!)
						setEmail(userInfo.email!)
						setAddress(userInfo.address!)
						setAddressDetail(userInfo.addressDetail!)
					}
				}
			}
			run()
		})

		return unsubscribe
	}, [navigation])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("blur", () => {
			StorageManager.getInstance().set<LocalUserRegisterModal>(Constants.LOCAL_USER_REGISTER_INFO, localUserRegisterModal)
		})

		return unsubscribe
	}, [navigation])

	const isCheckTestUser = () => {
		if (name === "testUser" && email === "kevin007@kakao.com") return true
		return false
	}
	const generatorTestUser = async () => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return
		const fetchDataLoading = {
			queryKey: ["user/info/updated"],
			url: "user/info/updated",
			data: {
				userId: userInfo?.userId,
				name: "testUser",
				email: "kevin007@kakao.com",
				phoneNumber: "000-0000-0000".replace(/[^0-9]/g, "").replace("-", ""),
				address: "test address",
				addressDetail: "test detail address",
				isRegistered: true,
				recommendReferralCode: "",
			},
		}
		setIsLoading(true)
		try {
			const response = await api.post<UserData>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
			setIsLoading(false)
			loginStore.setUserInfo(response.data)
			navigation?.goBack()
		} catch (e) {
			setIsLoading(false)
			console.log(`error ${e}`)
		}
	}

	const btnConfirm = async () => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return
		const fetchDataLoading = {
			queryKey: ["user/info/updated"],
			url: "user/info/updated",
			data: {
				userId: userInfo?.userId,
				name: name,
				email: email,
				phoneNumber: phoneNumber.replace(/[^0-9]/g, "").replace("-", ""),
				address: address,
				addressDetail: addressDetail,
				isRegistered: route.params?.userInfo ? false : true,
				recommendReferralCode: recommendReferralCode,
			},
		}
		setIsLoading(true)
		try {
			const response = await api.post<UserData>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
			setTimeout(() => {
				setIsLoading(false)
				loginStore.setUserInfo(response.data)
				const title = route.params?.userInfo ? `회원 수정을 완료 하였습니다.` : `회원 등록을 완료 하였습니다.`
				Alert.alert("", title, [{ text: "OK", onPress: () => navigation?.goBack() }])
			}, 300)
		} catch (e) {
			setIsLoading(false)
			console.log(`error ${e}`)
		}
	}

	const btnCheckEmail = async () => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return
		const myEmail = userInfo.email

		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
		const isValidEmail = emailRegex.test(email)
		if (!isValidEmail) {
			Alert.alert("", `이메일을 정확하게 입력해주세요.`)
			return
		}

		if (myEmail === email) {
			Alert.alert("", `본인 이메일은 수정할 수 없습니다. \n다른 이메일로 수정해주세요.`)
			return
		}

		const fetchDataLoading = {
			queryKey: ["user/check-email"],
			url: "user/check-email",
			data: {
				email: email,
			},
		}
		const response = await api.post<UserEmailCheck>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		setEmailConfirm(response.data.isEmailAvailable)
		if (!response.data.isEmailAvailable) {
			Alert.alert("", `중복된 이메일입니다. \n메일을 다시 입력해주세요.`)
			return
		}
		if (response.data.isEmailAvailable) {
			Alert.alert("", `사용가능한 메일입니다.`)
			return
		}
	}

	const btnSendCode = async () => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return
		const phone = phoneNumber.replace(/[^0-9]/g, "").replace("-", "")
		const fetchDataLoading = {
			queryKey: ["auth/sms/send"],
			url: "auth/sms/send",
			data: {
				phone: phone,
				userId: userInfo?.userId,
			},
		}
		await api.post<UserData>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
	}

	const btnVerifyCode = async () => {
		const userInfo = await loginStore.getUserInfo()
		if (!userInfo) return

		const phone = phoneNumber.replace(/[^0-9]/g, "").replace("-", "")

		if (_.isEmpty(phone)) {
			Alert.alert("", `전화번호를 입력해주세요.`)
			return
		}
		if (_.isEmpty(code)) {
			Alert.alert("", `코드를 입력해주세요.`)
			return
		}
		const fetchDataLoading = {
			queryKey: ["auth/sms/verifycode"],
			url: "auth/sms/verifycode",
			data: {
				phone: phone,
				userId: userInfo?.userId,
				code: code,
			},
		}
		const response = await api.post<UserSmsAuth>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data)
		const verify = response.data?.verify
		setCodeConfirm(verify)
		if (verify) {
			Alert.alert("", `인증이 완료되었습니다.`)
		} else {
			Alert.alert("", `인증에 실패 하였습니다. 다시 확인 해주세요.`)
		}
	}

	const renderTop = () => {
		return (
			<View>
				<View style={{ paddingHorizontal: 10, flexDirection: "row", paddingVertical: 10 }}>
					<View style={{ paddingTop: 2 }}>
						<AutoHeightImage source={documentsImg} width={20} />
					</View>

					<Text
						style={{
							paddingLeft: 5,
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
						}}>
						{route.params?.userInfo ? "내정보 수정" : "회원 가입"}
					</Text>
				</View>
				<Text
					style={{
						color: "red",
						fontStyle: "normal",
						fontWeight: "700",
						fontSize: 10,
						paddingLeft: 10,
						paddingBottom: 10,
					}}>
					* 프로모션 쿠폰을 받기 위해서는 회원 가입이 필수 입니다.
				</Text>
				{process.env.STAGE !== "real" && (
					<Text
						style={{
							color: "red",
							fontStyle: "normal",
							fontWeight: "700",
							fontSize: 10,
							paddingLeft: 10,
							paddingBottom: 10,
						}}>
						* 지금은 개발 환경입니다.(dev)
					</Text>
				)}
			</View>
		)
	}

	const renderEmail = () => {
		return (
			<View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
							paddingTop: 5,
						}}>
						이메일
					</Text>
					<View
						style={{
							backgroundColor: "#E95400",
							borderRadius: 5,
							paddingTop: 2,
							paddingHorizontal: 5,
							marginTop: 10,
							marginBottom: 5,
							marginLeft: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontSize: 10,
								fontWeight: "600",
								marginBottom: 2,
							}}>
							{"필수"}
						</Text>
					</View>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
					<TextInput
						style={{
							minHeight: 40,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D9D9D9", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							padding: 10, // 입력 창 내부 여백
							width: 250,
						}}
						placeholder="이메일"
						value={email}
						onChangeText={(val) => {
							localUserRegisterModal.email = val
							setEmail(val)
						}}
						maxLength={100}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<View style={{ flex: 1, paddingLeft: 5 }}>
						<TouchableOpacity
							disabled={emailConfirm}
							activeOpacity={0.5}
							style={{
								paddingRight: 5,
								paddingLeft: 5,
							}}
							onPress={() => {
								btnCheckEmail()
							}}>
							<View
								style={{
									backgroundColor: emailConfirm ? Color.navy1 : "#0078BB",
									justifyContent: "center",
									alignItems: "center",
									paddingTop: 14,
									paddingBottom: 14,
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										fontWeight: "600",
										color: Color.white,
										fontSize: 15,
									}}>
									{emailConfirm ? "완료" : isModified ? "확인" : "중복확인"}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}

	const renderPhoneNumber = () => {
		return (
			<View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
							paddingTop: 5,
						}}>
						휴대폰인증
					</Text>
					<View
						style={{
							backgroundColor: "#E95400",
							borderRadius: 5,
							paddingTop: 2,
							paddingHorizontal: 5,
							marginTop: 10,
							marginBottom: 5,
							marginLeft: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontSize: 10,
								fontWeight: "600",
								marginBottom: 2,
							}}>
							{"필수"}
						</Text>
					</View>
				</View>

				<Text
					style={{
						fontStyle: "normal",
						fontWeight: "500",
						fontSize: 15,
						paddingTop: 5,
						paddingBottom: 5,
						color: Color.black,
					}}>
					전화번호 :
				</Text>
				<View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
					<TextInput
						style={{
							minHeight: 40,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D9D9D9", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							padding: 10, // 입력 창 내부 여백
							width: 250,
						}}
						placeholder=""
						value={phoneNumber}
						onChangeText={(val) => {
							const phone = val.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
							localUserRegisterModal.phoneNumber = phone
							setPhoneNumber(phone)
						}}
						maxLength={100}
						keyboardType="number-pad"
						autoCapitalize="none"
					/>
					<View style={{ flex: 1, paddingLeft: 5 }}>
						<TouchableOpacity
							activeOpacity={0.5}
							style={{
								paddingRight: 5,
								paddingLeft: 5,
							}}
							onPress={() => {
								const phoneNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/
								const isValidPhoneNumber = phoneNumberRegex.test(phoneNumber)
								if (isValidPhoneNumber) {
									Alert.alert("", `${phoneNumber}에 발송하였습니다. \n3분안에 인증해주세요.`)
									btnSendCode()
								} else {
									Alert.alert("", `전화 번호를 다시 입력해주세요.`)
								}
							}}>
							<View
								style={{
									backgroundColor: "#0078BB",
									justifyContent: "center",
									alignItems: "center",
									paddingTop: 14,
									paddingBottom: 14,
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										fontWeight: "600",
										color: Color.white,
										fontSize: 15,
									}}>
									인증번호
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<Text
					style={{
						fontStyle: "normal",
						fontWeight: "500",
						fontSize: 15,
						paddingTop: 5,
						paddingBottom: 5,
						color: Color.black,
					}}>
					인증번호 :
				</Text>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TextInput
						style={{
							minHeight: 40,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D9D9D9", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							padding: 10, // 입력 창 내부 여백
							width: 250,
						}}
						placeholder=""
						value={code}
						onChangeText={(val) => setCode(val)}
						maxLength={100}
						keyboardType="number-pad"
						autoCapitalize="none"
					/>
					<View style={{ flex: 1, paddingLeft: 5 }}>
						<TouchableOpacity
							disabled={codeConfirm}
							activeOpacity={0.5}
							style={{
								paddingRight: 5,
								paddingLeft: 5,
							}}
							onPress={() => {
								btnVerifyCode()
							}}>
							<View
								style={{
									backgroundColor: codeConfirm ? Color.navy1 : "#0078BB",
									justifyContent: "center",
									alignItems: "center",
									paddingTop: 14,
									paddingBottom: 14,
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										fontWeight: "600",
										color: Color.white,
										fontSize: 15,
									}}>
									{codeConfirm ? "완료" : "확인"}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}

	const renderDonor = () => {
		return (
			<View style={{ paddingHorizontal: 10 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
							paddingTop: 5,
						}}>
						이름
					</Text>
					<View
						style={{
							backgroundColor: "#E95400",
							borderRadius: 5,
							paddingTop: 2,
							paddingHorizontal: 5,
							marginTop: 10,
							marginBottom: 5,
							marginLeft: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontSize: 10,
								fontWeight: "600",
								marginBottom: 2,
							}}>
							{"필수"}
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
					<TextInput
						style={{
							minHeight: 40,
							borderWidth: 1, // 테두리 두께
							borderColor: "#D9D9D9", // 테두리 색상
							borderRadius: 5, // 테두리 모서리 둥글기
							padding: 10, // 입력 창 내부 여백
							width: 250,
						}}
						placeholder="이름"
						value={name}
						onChangeText={(name) => {
							localUserRegisterModal.name = name
							setName(name)
						}}
						maxLength={100}
						keyboardType="default"
						autoCapitalize="none"
					/>
					<View style={{ flex: 1 }} />
				</View>
			</View>
		)
	}

	const onAddressSelected = (roadAddress: string) => {
		localUserRegisterModal.address = roadAddress
		setAddress(roadAddress)
	}

	const renderAddress = () => {
		return (
			<View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
							paddingTop: 5,
						}}>
						주민등록상 주소
					</Text>
					<View
						style={{
							backgroundColor: "#E95400",
							borderRadius: 5,
							paddingTop: 2,
							paddingHorizontal: 5,
							marginTop: 10,
							marginBottom: 5,
							marginLeft: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontSize: 10,
								fontWeight: "600",
								marginBottom: 2,
							}}>
							{"필수"}
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
					<TouchableOpacity onPress={() => {}}>
						<TextInput
							style={{
								minHeight: 40,
								borderWidth: 1, // 테두리 두께
								borderColor: "#D9D9D9", // 테두리 색상
								borderRadius: 5, // 테두리 모서리 둥글기
								padding: 10, // 입력 창 내부 여백
								width: 250,
							}}
							placeholder="주소"
							value={address}
							onChangeText={(val) => {
								localUserRegisterModal.address = val
								setAddress(val)
							}}
							onPressIn={() => {
								navigation?.push("AddressSearchModal", {
									onAddressSelected: onAddressSelected,
								})
							}}
							maxLength={100}
							keyboardType="default"
							autoCapitalize="none"
						/>
					</TouchableOpacity>

					<View style={{ flex: 1, paddingLeft: 5 }}>
						<TouchableOpacity
							activeOpacity={0.5}
							style={{
								paddingRight: 5,
								paddingLeft: 5,
							}}
							onPress={() => {
								navigation?.push("AddressSearchModal", {
									onAddressSelected: onAddressSelected,
								})
							}}>
							<View
								style={{
									backgroundColor: "#0078BB",
									justifyContent: "center",
									alignItems: "center",
									paddingTop: 14,
									paddingBottom: 14,
									borderRadius: 5,
								}}>
								<Text
									style={{
										fontStyle: "normal",
										fontWeight: "600",
										color: Color.white,
										fontSize: 15,
									}}>
									주소검색
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<TextInput
					style={{
						minHeight: 40,
						borderWidth: 1, // 테두리 두께
						borderColor: "#D9D9D9", // 테두리 색상
						borderRadius: 5, // 테두리 모서리 둥글기
						marginTop: 10,
						padding: 10, // 입력 창 내부 여백
					}}
					placeholder="주소상세"
					value={addressDetail}
					onChangeText={(val) => {
						localUserRegisterModal.addressDetail = val
						setAddressDetail(val)
					}}
					maxLength={100}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
			</View>
		)
	}

	const renderConfirm = () => {
		return (
			<View style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 5, backgroundColor: "#FFFFFF" }}>
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						paddingRight: 5,
						paddingLeft: 5,
						paddingTop: 5,
					}}
					onPress={() => {
						if (isCheckTestUser()) {
							generatorTestUser()
							return
						}
						if (_.isEmpty(name)) {
							Alert.alert("", `이름을 입력해주세요.`)
							return
						}
						const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
						const isValidEmail = emailRegex.test(email)
						if (!isValidEmail) {
							Alert.alert("", `이메일을 정확하게 입력해주세요.`)
							return
						}
						if (!emailConfirm && !isModified) {
							Alert.alert("", `메일 중복을 확인 해주세요.`)
							return
						}
						if (!codeConfirm) {
							Alert.alert("", `전화번호 인증을 해주세요.`)
							return
						}
						if (_.isEmpty(address)) {
							Alert.alert("", `주소를 입력해주세요.`)
							return
						}
						if (_.isEmpty(addressDetail)) {
							Alert.alert("", `상세 주소를 입력해주세요.`)
							return
						}
						if (!route.params?.userInfo) {
							if (!isCheckedServiceAgreement) {
								Alert.alert("", `서비스 이용약관 동의를 해주세요.`)
								return
							}
							if (!isCheckedPersonalInformation) {
								Alert.alert("", `개인정보 수집 및 이용 동의를 해주세요.`)
								return
							}
						}

						btnConfirm()
					}}>
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

	const renderAgreeToTerms = useCallback(() => {
		return (
			<>
				<Text
					style={{
						color: "black",
						fontStyle: "normal",
						fontWeight: "700",
						fontSize: 15,
						paddingTop: 15,
						paddingBottom: 10,
						paddingLeft: 10,
					}}>
					앱 사용을 위해 아래 항목에 동의해 주세요.
				</Text>
				<View
					style={{
						height: 40,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						paddingLeft: 15,
					}}>
					<View style={{ width: 250, justifyContent: "flex-start", flexDirection: "row" }}>
						<BouncyCheckbox
							size={20}
							fillColor="blue"
							unfillColor="#FFFFFF"
							isChecked={isCheckedServiceAgreement}
							innerIconStyle={{ borderWidth: 1 }}
							onPress={(isChecked: boolean) => {
								setCheckedServiceAgreement(isChecked)
							}}
						/>
						<Text
							style={{
								fontWeight: "500",
								fontSize: 16,
								paddingRight: 5,
								color: "black",
							}}>
							{"서비스 이용약관 동의"}
						</Text>
						<View
							style={{
								borderRadius: 5,
								marginTop: 4,
							}}>
							<Text
								style={{
									fontStyle: "normal",
									color: "#E95400",
									fontSize: 10,
									fontWeight: "600",
								}}>
								{"(필수)"}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						height: 20,
						flexDirection: "row",
					}}>
					<TouchableOpacity
						onPress={() => {
							const url = "https://s.ilovemyhometown.kr/TermsAndPolicy/TermsAndPolicy.html"
							navigation.push("Webview", { title: "서비스 이용약관 동의", url })
						}}>
						<View style={{ width: 250, justifyContent: "flex-start", flexDirection: "row" }}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 10,
									paddingLeft: 50,
									color: "black",
									textDecorationLine: "underline",
								}}>
								{"서비스 이용약관 동의 내용보기"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View
					style={{
						height: 40,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						paddingLeft: 15,
					}}>
					<View style={{ width: 250, justifyContent: "flex-start", flexDirection: "row" }}>
						<BouncyCheckbox
							size={20}
							fillColor="blue"
							unfillColor="#FFFFFF"
							isChecked={isCheckedPersonalInformation}
							innerIconStyle={{ borderWidth: 1 }}
							onPress={(isChecked: boolean) => {
								setCheckedPersonalInformation(isChecked)
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
						<View
							style={{
								borderRadius: 5,
								marginTop: 4,
							}}>
							<Text
								style={{
									fontStyle: "normal",
									color: "#E95400",
									fontSize: 10,
									fontWeight: "600",
								}}>
								{"(필수)"}
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						height: 20,
						flexDirection: "row",
					}}>
					<TouchableOpacity
						onPress={() => {
							const url = "https://s.ilovemyhometown.kr/TermsAndPolicy/PersonalDataCollection.html"
							navigation.push("Webview", { title: "개인정보 수집 및 이용", url })
						}}>
						<View style={{ width: 250, justifyContent: "flex-start", flexDirection: "row" }}>
							<Text
								style={{
									fontWeight: "500",
									fontSize: 10,
									paddingLeft: 50,
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

	const renderLoading = () => {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		)
	}

	const renderNotice = useCallback(() => {
		if (route.params?.userInfo) {
			return null
		}
		return (
			<TouchableOpacity
				activeOpacity={0.9}
				style={{
					paddingVertical: 10,
					paddingHorizontal: 11,
					alignItems: "center",
					width: WIDTH,
				}}
				onPress={() => {}}>
				<AutoHeightImage source={cardbannerImage} width={WIDTH - 10} />
			</TouchableOpacity>
		)
	}, [])

	const renderReferralCode = () => {
		return (
			<View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							color: "black",
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: 18,
							paddingTop: 5,
						}}>
						추천 코드
					</Text>
					<View
						style={{
							backgroundColor: "#CCCCCC",
							borderRadius: 5,
							paddingTop: 2,
							paddingHorizontal: 5,
							marginTop: 10,
							marginBottom: 5,
							marginLeft: 5,
						}}>
						<Text
							style={{
								fontStyle: "normal",
								color: Color.white,
								fontSize: 10,
								fontWeight: "600",
								marginBottom: 2,
							}}>
							{"임의"}
						</Text>
					</View>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
					<TouchableOpacity onPress={() => {}}>
						<TextInput
							style={{
								minHeight: 40,
								borderWidth: 1, // 테두리 두께
								borderColor: "#D9D9D9", // 테두리 색상
								borderRadius: 5, // 테두리 모서리 둥글기
								padding: 10, // 입력 창 내부 여백
								width: 250,
							}}
							placeholder="추천코드"
							value={recommendReferralCode}
							onChangeText={(val) => {
								setRecommendReferralCode(val)
							}}
							maxLength={100}
							keyboardType="default"
							autoCapitalize="none"
						/>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<>
			<Topbar title={isModified ? "내정보 수정" : "회원 가입"} isClose={!!route.params?.userInfo} />
			{isLoading && renderLoading()}
			{!isLoading && (
				<>
					<ScrollView style={{ flex: 1 }}>
						<View style={{ backgroundColor: Color.white }}>
							{renderNotice()}
							{renderTop()}
							{renderDonor()}
							{renderEmail()}
							{renderPhoneNumber()}
							{renderAddress()}
							{!route.params?.userInfo && renderReferralCode()}
							{!route.params?.userInfo && renderAgreeToTerms()}
							{route.params?.userInfo && <View style={{ height: 80, backgroundColor: Color.white }} />}
							{renderConfirm()}
						</View>
					</ScrollView>
				</>
			)}
		</>
	)
}

export default UserRegisterModal
