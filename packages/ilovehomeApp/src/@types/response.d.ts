export interface ProductListResponse {
	readonly id: string
	readonly title: string
	readonly description: string
	readonly price: number
	readonly goods_id: string
	readonly prefectureid: number
	readonly prefectureName: string
	readonly image_thumbnail: string
	readonly shipping_cost: string
	readonly origin: string
	readonly manufacturer: string
	readonly main_product_image: string
	readonly product_images: object
	readonly product_detail_contents: string
	readonly product_external_url: string
	readonly request_promotionyn: boolean
	readonly request_promotion_count: number
	readonly request_promotion_max: number
	readonly useyn: boolean
	readonly promotionyn: boolean
}

export interface NoticeInfoResponse {
	title: string
	contents: string
	textAlign: string
	createdAt: string
	updateAt: string
}

export interface VersionInfoResponse {
	needshowOptionUpdate: number
	forceUpdate: number
}

export interface PromotionInfoResponse {
	userId: string
	goods_id: string
	status: string
	imageUrl: string
}

export type PromotionRequestResponse<
	T = {
		request_promotion_count: number
		request_promotion_max: number
		goods_id: string
		userId: string
		promotionServey: string
	}
> = T extends {
	goods_id: string
	userId: string
	promotionServey: string
}
	? T
	: {
			goods_id: string
			request_promotion_count: number
			request_promotion_max: number
	  }

export type ProductListRenderItem = {
	id: number
	itemLeft: ProductListResponse
	itemRight?: ProductListResponse
}
export interface UserData {
	readonly userId: string
	readonly email?: string
	readonly name?: string
	readonly nickname?: string
	readonly profile_image?: string
	readonly thumbnail_image?: string
	readonly phoneNumber?: string
	readonly address?: string
	readonly addressDetail?: string
	readonly isRegistered?: boolean
	readonly referralCode?: string
}

export interface UserSmsAuth {
	userId: string
	verify: boolean
}

export interface UserEmailCheck {
	isEmailAvailable: boolean
}
