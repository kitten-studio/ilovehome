import axios, { AxiosResponse } from "axios"
import { loginStore } from "../account/LoginStore"

interface CallbackFunc {
	(config: AxiosResponse): AxiosResponse | Promise<AxiosResponse>
}

export type ErrorInterceptor = (e: InterceptorError) => void

export class InterceptorError extends Error {
	statusCode: number
	code: string

	constructor(statusCode?: number | null, code?: string, message?: string) {
		super(message)
		this.statusCode = statusCode || -1
		this.code = code || "Unknown Error"
	}
}

// url 호출 시 기본 값 셋팅
const api = axios.create({
	baseURL: `${process.env.API_HOST}`,
	headers: { "Content-type": "application/json" }, // data type
})

api.interceptors.request.use(
	async (config) => {
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

api.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const {
			config,
			response: { status },
		} = error
		if (status === 401) {
			if (error.response.data.message === "Unauthorized") {
				const originalRequest = config
				const accessToken = await loginStore.getAccessToken()
				if (accessToken) {
					originalRequest.headers.authorization = `Bearer ${accessToken}`
					return axios(originalRequest)
				}
			}
		}
		return Promise.reject(error)
	}
)

export default api
