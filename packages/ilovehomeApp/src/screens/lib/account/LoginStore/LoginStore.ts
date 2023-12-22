import { UserData } from "@main/@types/response"
import Constants from "@main/common/Constants"
import { StorageManager } from "@main/screens/lib/StorageManager"
import jwt_decode from "jwt-decode"
import _ from "lodash"
import moment from "moment"
import { loginService } from "./Service"

export interface LoginAuthData {
	access_token: string
	refresh_token: string
}

export enum LoginUserType {
	General = "1",
	PhoneAuth = "2",
	Admin = "3",
}

export interface UserInfo extends UserData {
	is_agent?: boolean
	user_type?: LoginUserType
}

export enum LoginAuthClientErrorType {
	FailedToRegisterLoginInfo = "Login Information Register Failed",
	NotLoggedInUser = "has not logined user",
	InvalidValueForExpirationCheck = "JWT expired token",
}

export type ClientID = "ilovehome"
// 초기 세팅 정보
export type LoginStoreProps = {
	clientId: ClientID
}

class LoginStore {
	private authData: LoginAuthData = { access_token: "", refresh_token: "" }
	private userInfo: UserInfo = {
		userId: "",
	}

	async initStore(props: LoginStoreProps) {
		const { clientId } = props
		await this.loadAuthInfoFromStorage()
		await this.loadUserInfoFromStorage()
	}

	setAuthInfo(auth: LoginAuthData): void {
		this.authData.access_token = auth.access_token
		this.authData.refresh_token = auth.refresh_token
		StorageManager.getInstance().set(Constants.LOCAL_STORAGE_ACCESS_TOKEN_KEY, auth.access_token)
		StorageManager.getInstance().set(Constants.LOCAL_STORAGE_REFRESH_TOKEN_KEY, auth.refresh_token)
	}

	setUserInfo(userInfo: UserInfo) {
		this.userInfo = { ...this.userInfo, ...userInfo }
		StorageManager.getInstance().set<UserInfo>(Constants.LOCAL_STORAGE_USER_INFO, userInfo)
	}

	async getAuthInfo(): Promise<LoginAuthData> {
		if (this.authData.access_token && this.authData.refresh_token) {
			return this.authData
		}
		await this.loadAuthInfoFromStorage()
		return this.authData
	}
	public async getAccessToken(): Promise<string | null> {
		try {
			const check = this.validateAuthenticationInfo()
			// console.log("getAccessToken", check)
			if (!check) {
				await this.renewAuthInfoInMemory()
			}
			const authInfo = await this.getAuthInfo()
			return authInfo.access_token ?? null
		} catch (e) {
			return null
		}
	}

	public async getUserInfo(immediately: boolean = false): Promise<UserInfo | null> {
		try {
			if (immediately) {
				await this.getAccessToken()
				await this.getUserInfoWithAccessToken()
				return this.userInfo
			}
			if (!_.isEmpty(this.userInfo.userId)) return this.userInfo
			await this.getAccessToken()
			await this.getUserInfoWithAccessToken()
			return this.userInfo
		} catch (e) {
			return null
		}
	}

	public async isLoggedIn(): Promise<boolean> {
		try {
			const check = this.validateAuthenticationInfo()
			// console.log(`### isLoggedIn validateAuthenticationInfo ${check}`)
			if (!check) {
				await this.renewAuthInfoInMemoryWithUserInfo()
			}
			const { access_token } = this.authData
			if (_.isEmpty(access_token)) {
				// console.log(`### isLoggedIn access_token ${access_token}`)
				return false
			}
			return true
		} catch (e) {
			return false
		}
	}

	private isExpired(jwt?: string | null) {
		if (!jwt) throw new Error(LoginAuthClientErrorType.InvalidValueForExpirationCheck)
		const decoded: { [key: string]: string | number | boolean } = jwt_decode(jwt)
		const currentTimeInSeconds = moment().unix()
		const exp = Number(decoded.exp) - 600
		// console.log(`isExpired ${exp < currentTimeInSeconds} ${currentTimeInSeconds} ${exp} `)
		return decoded.exp ? exp < currentTimeInSeconds : false
	}

	private validateAuthenticationInfo() {
		const { access_token } = this.authData
		// console.log(`### access_token ${access_token}`)
		try {
			// console.log(`validateAuthenticationInfo ${access_token}`)
			if (this.isExpired(access_token)) {
				// console.log(`validateAuthenticationInfo false`)
				return false
			}
		} catch (e) {}
		// console.log(`validateAuthenticationInfo true`)
		return true
	}

	private async loadAuthInfoFromStorage() {
		const access_token = await StorageManager.getInstance().get<string>(Constants.LOCAL_STORAGE_ACCESS_TOKEN_KEY)
		const refresh_token = await StorageManager.getInstance().get<string>(Constants.LOCAL_STORAGE_REFRESH_TOKEN_KEY)
		if (access_token !== null && refresh_token !== null) {
			// console.log(`### loadAuthInfoFromStorage ${access_token} ${refresh_token}`)
			this.authData = { access_token, refresh_token }
		}
	}
	private async loadUserInfoFromStorage() {
		try {
			const userInfo = await StorageManager.getInstance().get<UserInfo>(Constants.LOCAL_STORAGE_USER_INFO)
			this.userInfo = { ...this.userInfo, ...userInfo }
		} catch (e) {
			//
		}
	}
	private isFirstValidationCheckAfterAppLaunch = (() => {
		let isInitialValidationCheck = true
		return () => {
			if (isInitialValidationCheck) {
				isInitialValidationCheck = false
				return true
			}
			return false
		}
	})()

	async validateAndRefreshIntegrationToken(): Promise<boolean> {
		const { access_token, refresh_token } = this.authData
		try {
			if (this.isExpired(access_token)) {
				try {
					const response = await loginService.refreshAuth(this.userInfo.userId, refresh_token)
					this.setAuthInfo({ access_token: response.access_token, refresh_token: response.refresh_token })
				} catch (error) {
					if (error.response && error.response?.status === 401) {
						// console.log(`### clearAuthentication 1`)
						// await this.clearAuthentication()
					} else {
						console.error("Failed to refresh auth info:", error)
					}
					return false
				}
			} else {
				this.setAuthInfo({ access_token, refresh_token })
			}
		} catch (e) {
			console.error("Failed to expired:", e)
			return false
		}

		return true
	}

	async getUserInfoWithAccessToken() {
		const { userId } = this.userInfo
		const { access_token } = this.authData
		// console.log(`renewAuthInfoInMemoryWithUserInfo ${userId} ${JSON.stringify(access_token)}`)
		try {
			const userInfo = await loginService.getUserInfo(userId, access_token)
			// console.log(`getUserInfoWithAccessToken userInfo ${JSON.stringify(userInfo)}`)
			this.setUserInfo(userInfo)
		} catch (e) {
			// console.log(`### clearAuthentication 2`)
			// this.clearAuthentication()
			throw new Error(LoginAuthClientErrorType.NotLoggedInUser)
		}
	}

	async clearAuthentication(): Promise<void> {
		try {
			await StorageManager.getInstance().clear(Constants.LOCAL_STORAGE_ACCESS_TOKEN_KEY)
			await StorageManager.getInstance().clear(Constants.LOCAL_STORAGE_REFRESH_TOKEN_KEY)
			await StorageManager.getInstance().clear(Constants.LOCAL_STORAGE_USER_INFO)
			this.authData = { access_token: "", refresh_token: "" }
			this.userInfo = { userId: "" }
		} catch (error) {
			console.error("Failed to clear authentication:", error)
			throw error
		}
	}

	private async renewAuthInfoInMemory() {
		await this.loadAuthInfoFromStorage()
		await this.loadUserInfoFromStorage()
		const validateAndRefreshIntegrationToken = await this.validateAndRefreshIntegrationToken()
		// console.log("renewAuthInfoInMemory", validateAndRefreshIntegrationToken)
		if (validateAndRefreshIntegrationToken) {
			return
		}

		throw new Error(LoginAuthClientErrorType.NotLoggedInUser)
	}

	private async renewAuthInfoInMemoryWithUserInfo() {
		await this.loadAuthInfoFromStorage()
		await this.loadUserInfoFromStorage()
		const isFirstValidationCheckAfterAppLaunch = this.isFirstValidationCheckAfterAppLaunch()
		const validateAndRefreshIntegrationToken = await this.validateAndRefreshIntegrationToken()
		// console.log("renewAuthInfoInMemoryWithUserInfo", validateAndRefreshIntegrationToken)
		if (isFirstValidationCheckAfterAppLaunch || validateAndRefreshIntegrationToken) {
			await this.getUserInfoWithAccessToken()
			return
		}

		throw new Error(LoginAuthClientErrorType.NotLoggedInUser)
	}
}

export const loginStore = new LoginStore()
