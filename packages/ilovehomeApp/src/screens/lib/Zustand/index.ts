import { State, InitialState, StoreApi } from "@main/@types/zustand"
import create, { StoreApi as StoreApiOrigin, UseBoundStore } from "zustand"
import createContext from "zustand/context"
import { subscribeWithSelector, devtools } from "zustand/middleware"
import { initialState as detailInitialState } from "@main/screens/lib/Zustand/store/detailScreen"
import { initialState as homeInitialState } from "@main/screens/lib/Zustand/store/homeScreen"
import { initialState as listInitialState } from "@main/screens/lib/Zustand/store/listScreen"

const getDefaultInitialState = (): State => ({
	detailScreen: detailInitialState,
	homeScreen: homeInitialState,
	listScreen: listInitialState,
})
