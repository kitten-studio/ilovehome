import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { loginStore } from "./LoginStore"
import _ from "lodash"

export const isLogin = async (navigation: NativeStackNavigationProp<ParamListBase>) => {
	if (!(await loginStore.isLoggedIn())) {
		navigation.push("ProviderLoginModal", { isRegister: true })
		return false
	} else {
		const userInfo = await loginStore.getUserInfo(true)
		if (!_.isEmpty(userInfo)) {
			if (!userInfo?.isRegistered) {
				navigation.push("UserRegisterModal")
				return false
			}
		}
	}
	return true
}
