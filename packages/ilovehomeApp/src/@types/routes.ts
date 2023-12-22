export enum RouterCategory {
	ilovehomeApp = "ilovehome-app",
	ilovehomeWeb = "ilovehome-web",
}

export interface RouteType {
	urlPath: string
	category: RouterCategory[]
	name: string
	params?: any
}

export type RouteTypeForApp = RouteType & {
	appScreen: any
}

export type RouteConfig = {
	screenPath: string
	path: string
}

export interface RouteConfigMap {
	[routeName: string]: RouteConfig
}
