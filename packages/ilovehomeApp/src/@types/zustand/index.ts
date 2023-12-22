import { Mutate, StoreApi as StoreApiOrigin } from "zustand"
import { DetailScreen } from "@main/@types/zustand/store/detailScreen"
import { Subscription } from "./store/subscription"
import { HomeScreen } from "./store/homeScreen"
import { ListScreen } from "./store/listScreen"

export type State = {
	detailScreen: DetailScreen
	homeScreen: HomeScreen
	listScreen: ListScreen
}
