import { CommonActions, useNavigation } from "@react-navigation/native"
import React, { FC } from "react"
import { ColorValue, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Color } from "../common/Color"
import { ViewDimension } from "../lib/ViewDimension"

const WIDTH = ViewDimension.get().width

interface TopbarProps {
	title?: string
	isLeft?: boolean
	color?: ColorValue
	isClose?: boolean
	isHome?: boolean
	notchPadding?: number
	onClose?: () => void
}

const Topbar: FC<TopbarProps> = (props) => {
	const { title, isLeft, isClose, color, notchPadding, isHome } = props
	const navigation = useNavigation()

	const goToHome = () => {
		navigation?.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [
					{
						name: "Index",
						params: {},
					},
				],
			})
		)
	}

	return (
		<View
			style={{
				backgroundColor: color === undefined ? Color.white : color,
				height: 52,
				marginTop: notchPadding ? notchPadding : 0,
			}}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 20, color: color === undefined ? Color.black : Color.white }}>{title}</Text>
			</View>
			{isHome && (
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						position: "absolute",
						top: 0,
						bottom: 0,
						left: WIDTH - 62,
						right: 0,
						width: 62,
						height: 52,
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={goToHome}>
					<IconMaterialCommunityIcons name="home" color={Color.gray30} size={32} />
				</TouchableOpacity>
			)}
			{isLeft && (
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						width: 62,
						height: 52,
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => {
						navigation.goBack()
					}}>
					<Icon name="chevron-left" color={Color.gray30} size={32} />
				</TouchableOpacity>
			)}
			{isClose && (
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						width: 62,
						height: 52,
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => {
						if (props?.onClose) {
							props?.onClose()
						} else {
							navigation.goBack()
						}
					}}>
					<Ionicons name="close-sharp" color={Color.gray30} size={32} />
				</TouchableOpacity>
			)}
		</View>
	)
}

export default Topbar
