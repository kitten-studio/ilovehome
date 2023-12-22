import { useFocusEffect } from "@react-navigation/native"
import React from "react"
import { BackHandler } from "react-native"
import { useStore } from "../lib/Zustand"

export const useBackPressEffect = (props: Props) => {
	const { isCalculateDonationPoints, update } = useStore((state) => ({
		isCalculateDonationPoints: state.homeScreen.isCalculateDonationPoints,
		update: state.update,
	}))

	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => {
				if (isCalculateDonationPoints) {
					update("homeScreen", { isCalculateDonationPoints: false })
					return true
				} else {
					return false
				}
			}

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

			return () => subscription.remove()
		}, [isCalculateDonationPoints])
	)
}

type Props = {}
