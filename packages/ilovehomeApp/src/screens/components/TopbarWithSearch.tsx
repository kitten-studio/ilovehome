import { useNavigation } from "@react-navigation/native"
import React, { FC, useEffect, useState } from "react"
import {
	ColorValue,
	Keyboard,
	NativeSyntheticEvent,
	Text,
	TextInput,
	TextInputKeyPressEventData,
	TouchableOpacity,
	View,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Color } from "../common/Color"

interface TopbarWithSearchProps {
	title?: string
	isLeft?: boolean
	color?: ColorValue
	isClose?: boolean
	notchPadding?: number
	onClose?: () => void
	onChangeText?: (text: string) => void
}

const TopbarWithSearch: FC<TopbarWithSearchProps> = (props) => {
	const { color, notchPadding, onChangeText } = props
	const navigation = useNavigation()

	return (
		<View
			style={{
				backgroundColor: color === undefined ? Color.white : color,
				height: 52,
				marginTop: notchPadding ? notchPadding : 0,
				flexDirection: "row",
			}}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingLeft: 10 }}>
				<TextInput
					style={{
						minHeight: 30,
						borderWidth: 1, // 테두리 두께
						borderColor: Color.black, // 테두리 색상
						borderRadius: 10, // 테두리 모서리 둥글기
						padding: 2, // 입력 창 내부 여백
						paddingLeft: 10,
						width: "100%",
					}}
					autoFocus
					placeholder="답례품 찾기"
					onChangeText={(val) => {
						onChangeText?.(val)
					}}
					maxLength={100}
					autoCapitalize="none"
				/>
			</View>
			<TouchableOpacity
				activeOpacity={0.5}
				style={{
					paddingRight: 10,
					paddingLeft: 10,
					justifyContent: "center",
					alignItems: "center",
				}}
				onPress={() => {
					navigation.goBack()
				}}>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Text
						style={{
							fontStyle: "normal",
							fontWeight: "500",
							color: Color.black,
							fontSize: 13,
						}}>
						{"취소"}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

export default TopbarWithSearch
