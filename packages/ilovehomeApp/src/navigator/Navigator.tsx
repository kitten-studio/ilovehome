import type { RouteConfig, StackNavigationState } from "@react-navigation/core"
import { CardStyleInterpolators, StackNavigationEventMap, StackNavigationOptions, createStackNavigator } from "@react-navigation/stack"
import React from "react"

import { AppStackParamList } from "@main/@types/params"
import { CalculateDonationPoints } from "@main/screens/home/CalculateDonationPoints"
import { useStore } from "@main/screens/lib/Zustand"
import AddressSearchModal from "@main/screens/login/AddressSearchModal"
import LoginScreen from "@main/screens/login/Login"
import LoginModal from "@main/screens/login/LoginModal"
import ProviderLoginModal from "@main/screens/login/ProviderLoginModal"
import UserRegisterModal from "@main/screens/login/UserRegisterModal"
import MyInfoManager from "@main/screens/myinfo/MyInfoManager"
import ProductDetailScreen from "@main/screens/productdetail/ProductDetail"
import ProductDetailScreen2 from "@main/screens/productdetail/ProductDetail2"
import ProductDetailScreen3 from "@main/screens/productdetail/ProductDetail3"
import ProductsListScreen from "@main/screens/productslist/ProductsList"
import ProductsListScreen2 from "@main/screens/productslist/ProductsList2"
import ProductsListScreen3 from "@main/screens/productslist/ProductsList3"
import ProvinceListScreen from "@main/screens/provincelist/ProvinceList"
import SearchByLocalScreen from "@main/screens/search/SearchByLocal"
import SearchByRankingScreen from "@main/screens/search/SearchByRanking"
import SearchBySomethingScreen from "@main/screens/search/SearchBySomething"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import HomeScreen from "ilovehomeApp/src/screens/home/HomeScreen"
import IntroductionGuideScreen from "ilovehomeApp/src/screens/home/introduction/IntroductionGuide"
import MyInfoTabScreen from "ilovehomeApp/src/screens/myinfo/MyInfoTabScreen"
import { FC } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/Ionicons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import PromotionRequestList from "@main/screens/promotion/PromotionRequestList"
import PromotionList from "@main/screens/promotion/PromotionList"
import PhotoProductVerifier from "@main/screens/modals/PhotoProductVerifier"
import NoticeBoard from "@main/screens/myinfo/NoticeBoard"
import SupportCenter from "@main/screens/myinfo/SupportCenter"
import TermsAndPolicy from "@main/screens/myinfo/TermsAndPolicy"
import CurrentVersion from "@main/screens/myinfo/CurrentVersion"
import EmailInquiry from "@main/screens/myinfo/EmailInquiry"
import ServiceQnA from "@main/screens/myinfo/ServiceQnA"
import Webview from "@main/screens/lib/Webview"
import { TransitionSpec } from "@react-navigation/stack/lib/typescript/src/types"
import { Easing } from "react-native"
import GohyangPlusScreen from "@main/screens/home/introduction/GohyangPlus"
import GohyangPlusGuideScreen from "@main/screens/home/introduction/GohyangPlus"
import GohyangPlusTutorialScreen from "@main/screens/home/tutorial/GohyangPlusTutorial"
import SearchItemsScreen from "@main/screens/search/SearchItemsModal"
import NoticeBoardDetailScreen from "@main/screens/myinfo/NoticeBoardDetail"
import ServiceQnADetailScreen from "@main/screens/myinfo/ServiceQnADetail"
import AppPermissionNoticeModal from "@main/screens/login/AppPermissionNotice"
import AppUpdateModal from "@main/screens/login/AppUpdateModal"
import PromotionNoticeModal from "@main/screens/home/introduction/PromotionNoticeModal"
import GiftsScreen from "@main/screens/gifts/GiftsScreen"
import ContributorListScreen from "@main/screens/contributors/ContributorListScreen"

type AppStackRoutesType = RouteConfig<
	AppStackParamList,
	keyof AppStackParamList,
	StackNavigationState<AppStackParamList>,
	StackNavigationOptions,
	StackNavigationEventMap
>

export type IndexProps = NativeStackScreenProps<AppStackParamList, "Index">
const MainTab: FC<IndexProps> = () => {
	const { isCalculateDonationPoints } = useStore((state) => ({
		isCalculateDonationPoints: state.homeScreen.isCalculateDonationPoints,
	}))

	return (
		<>
			<Tab.Navigator>
				<Tab.Screen
					name="Home"
					component={HomeStack}
					options={{
						header: () => null,
						tabBarLabel: "홈",
						tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
					}}
				/>
				<Tab.Screen
					name="Gifts"
					component={GiftsScreen}
					options={{
						header: () => null,
						tabBarLabel: "랭킹",
						tabBarIcon: ({ color, size }) => <Icon name="gift" color={color} size={size} />,
					}}
				/>
				{/* <Tab.Screen
					name="Favorites"
					component={FavoritesScreen}
					options={{
						header: () => null,
						tabBarLabel: "찜",
						tabBarIcon: ({ color, size }) => <Icon name="heart" color={color} size={size} />,
					}}
				/> */}
				<Tab.Screen
					name="Contributors"
					component={ContributorListScreen}
					options={{
						header: () => null,
						tabBarLabel: "기부자",
						tabBarIcon: ({ color, size }) => <FontAwesome5 name="donate" color={color} size={size} />,
					}}
				/>
				<Tab.Screen
					name="MyInfo"
					component={MyInfoTabScreen}
					options={{
						header: () => null,
						tabBarLabel: "내정보",
						tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
					}}
				/>
			</Tab.Navigator>
			<CalculateDonationPoints isShow={isCalculateDonationPoints} />
		</>
	)
}

export const NoAnimationSpec: TransitionSpec = {
	animation: "timing",
	config: {
		duration: 0,
		easing: Easing.bezier(0.35, 0.45, 0, 1),
		delay: 0,
	},
}

// strictly typed array of app stack routes
const appStackRoutes: Array<AppStackRoutesType> = [
	{
		name: "Index",
		component: MainTab,
		options: {
			header: () => null,
		},
	},
	{
		name: "GohyangPlusTutorial",
		component: GohyangPlusTutorialScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "SearchItems",
		component: SearchItemsScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ServiceQnADetail",
		component: ServiceQnADetailScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "NoticeBoardDetail",
		component: NoticeBoardDetailScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "GohyangPlusGuide",
		component: GohyangPlusGuideScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "IntroductionGuide",
		component: IntroductionGuideScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "SearchBySomething",
		component: SearchBySomethingScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "SearchByRanking",
		component: SearchByRankingScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "SearchByLocal",
		component: SearchByLocalScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductsList",
		component: ProductsListScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductsList2",
		component: ProductsListScreen2,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductsList3",
		component: ProductsListScreen3,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductDetail",
		component: ProductDetailScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductDetail2",
		component: ProductDetailScreen2,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProductDetail3",
		component: ProductDetailScreen3,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "Login",
		component: LoginScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProvinceList",
		component: ProvinceListScreen,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ProviderLoginModal",
		component: ProviderLoginModal,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "MyInfoManager",
		component: MyInfoManager,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "PromotionRequestList",
		component: PromotionRequestList,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "PromotionList",
		component: PromotionList,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "NoticeBoard",
		component: NoticeBoard,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "SupportCenter",
		component: SupportCenter,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "TermsAndPolicy",
		component: TermsAndPolicy,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "CurrentVersion",
		component: CurrentVersion,
		options: {},
	},
	{
		name: "EmailInquiry",
		component: EmailInquiry,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
	{
		name: "ServiceQnA",
		component: ServiceQnA,
		options: {
			transitionSpec: {
				open: NoAnimationSpec,
				close: NoAnimationSpec,
			},
		},
	},
]

const AppStack = createStackNavigator<AppStackParamList>()

const RootStack = createStackNavigator()

interface PlaceHolderProps {}

const Tab = createBottomTabNavigator()

const Stack = createStackNavigator()

const HomeStack = () => {
	return (
		<>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={"HomeScreen"} component={HomeScreen} />
			</Stack.Navigator>
		</>
	)
}

export const MainNavigator: FC<PlaceHolderProps> = ({}) => {
	const screenOptions = ({ route }) => {
		if (route.name === "Index") {
			return {
				header: () => null,
				transitionSpec: {
					open: NoAnimationSpec,
					close: NoAnimationSpec,
				},
			}
		}

		return {
			header: () => null,
			headerShown: false,
		}
	}

	return (
		<>
			<SafeAreaView style={{ flex: 1, backgroundColor: "#009abc" }} edges={["right", "top", "left"]}>
				<RootStack.Navigator initialRouteName="Index" screenOptions={screenOptions}>
					<RootStack.Group>
						{appStackRoutes.map((stackRoute) => (
							<AppStack.Screen key={stackRoute.name} {...stackRoute} />
						))}
					</RootStack.Group>
					<RootStack.Group
						screenOptions={{
							presentation: "modal",
							transitionSpec: {
								open: NoAnimationSpec,
								close: NoAnimationSpec,
							},
						}}>
						<RootStack.Screen name="LoginModal" component={LoginModal} />
						<RootStack.Screen name="UserRegisterModal" component={UserRegisterModal} />
						<RootStack.Screen name="AddressSearchModal" component={AddressSearchModal} />
						<RootStack.Screen name="AppPermissionNoticeModal" component={AppPermissionNoticeModal} />
						<RootStack.Screen name="AppUpdateModal" component={AppUpdateModal} />
						<RootStack.Screen name="PhotoProductVerifier" component={PhotoProductVerifier} />
						<RootStack.Screen name="PromotionNoticeModal" component={PromotionNoticeModal} />
						<RootStack.Screen name="Webview" component={Webview} />
					</RootStack.Group>
				</RootStack.Navigator>
			</SafeAreaView>
		</>
	)
}
