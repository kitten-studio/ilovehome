import axios, { AxiosResponse } from "axios"
import { UserInfo } from "./LoginStore"

export interface LoginResponse {
	access_token: string
	refresh_token: string
	userId: string
}

export interface RefreshResponse {
	access_token: string
	refresh_token: string
}

class LoginService {
	async loginWithKakao(accessToken: string): Promise<LoginResponse> {
		try {
			const response: AxiosResponse<LoginResponse> = await axios.post(
				`${process.env.API_HOST}/auth/provider/login`,
				{
					providerType: "kakao",
					customToken: `${accessToken}`,
				},
				{
					headers: { "Content-Type": "application/json" },
				}
			)
			return response.data
		} catch (error) {
			console.error("Failed to login with Kakao:", error)
			throw error
		}
	}

	async refreshAuth(userId: string, refresh: string): Promise<RefreshResponse> {
		// console.log(`### ${userId} , ${refresh}`)
		try {
			const response: AxiosResponse<RefreshResponse> = await axios.post(
				`${process.env.API_HOST}/auth/refresh`,
				{
					userId,
					refresh: `${refresh}`,
				},
				{
					headers: { "Content-Type": "application/json", Authorization: `Bearer ${refresh}` },
				}
			)
			return response.data
		} catch (error) {
			console.error("Failed to refresh auth info:", error)
			throw error
		}
	}

	async getUserInfo(userId: string, access_token: string): Promise<UserInfo> {
		try {
			const response: AxiosResponse<UserInfo> = await axios.post(
				`${process.env.API_HOST}/user/profile`,
				{
					userId,
				},
				{
					headers: { "Content-Type": "application/json", Authorization: `Bearer ${access_token}` },
				}
			)
			return response.data
		} catch (error) {
			console.error("Failed to get the user info:", error)
			throw error
		}
	}
}

export const loginService = new LoginService()
