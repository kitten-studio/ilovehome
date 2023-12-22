import { ProductListResponse } from "@main/@types/response"
import { GohyangPlusTutorialProps } from "@main/screens/home/tutorial/GohyangPlusTutorial"
import { WebviewTypeProps } from "@main/screens/lib/Webview"
import { AddressSearchProps } from "@main/screens/login/AddressSearchModal"
import { ProviderLoginModalTypeProps } from "@main/screens/login/ProviderLoginModal"
import { UserRegisterModalTypeProps } from "@main/screens/login/UserRegisterModal"
import { MyInfoManagerTypeProps } from "@main/screens/myinfo/MyInfoManager"
import { ProductDetailScreenTypeProps } from "@main/screens/productdetail/ProductDetail3"
import { StackScreenProps } from "@react-navigation/stack"

export const FindingItemsName = [
	"FindByAmount",
	"FindByProducts",
	"FindByLocal",
	"FindByRanking",
	"FindByPromotion",
] as const
export type FindingItemsType = (typeof FindingItemsName)[number]

export type ProvinceName =
	| "seoulIMG"
	| "incheonIMG"
	| "gangwonIMG"
	| "gyeonggiIMG"
	| "chungbukIMG"
	| "sejong06"
	| "daejeonIMG"
	| "chungnamIMG"
	| "gyeongbukIMG"
	| "jeonbukIMG"
	| "daeguIMG"
	| "gyeongnamIMG"
	| "gangjuIMG"
	| "ulsanIMG"
	| "busanIMG"
	| "jeonnamIMG"
	| "jejuIMG"

export type IndexTabParamList = {
	Home: undefined
	Gifts: undefined
	Favorites: undefined
	MyInfo: undefined
	Contributors: undefined
}

// stack param list type
export type AppStackParamList = {
	[key: string]:
		| undefined
		| {
				[key: string]: any
		  }

	Index: undefined
	IntroductionGuide: undefined
	SearchBySomething: {
		type: FindingItemsType
	}
	SearchByRanking: undefined
	SearchByLocal: undefined
	ProductsList: {
		type: FindingItemsType
		itemName: string | undefined
	}
	ProductsList2: {
		type: FindingItemsType
		itemName: string | undefined
	}
	ProductsList3: {
		type: FindingItemsType
		itemName: string | undefined
	}
	ProductDetail: undefined
	ProductDetail2: {
		item: ProductListResponse
	}
	ProductDetail3: ProductDetailScreenTypeProps
	Login: undefined
	UserRegisterModal: UserRegisterModalTypeProps | undefined
	AddressSearchModal: AddressSearchProps
	ProvinceList: {
		provinceName: ProvinceName
	}
	ProviderLoginModal: ProviderLoginModalTypeProps
	MyInfoManager: MyInfoManagerTypeProps
	Webview: WebviewTypeProps
	AppPermissionNoticeModal: undefined
	AppUpdateModal: undefined
	GohyangPlusTutorial: GohyangPlusTutorialProps
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<AppStackParamList, T>
