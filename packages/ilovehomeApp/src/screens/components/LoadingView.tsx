import React, { FC, useCallback, useState } from "react"
import { View, Text } from "react-native"
import FastImage from "react-native-fast-image"

const GIF_URL = "https://s.ilovemyhometown.kr/icon/gift-loading-icon.gif"

interface Props {}

export const LoadingView: FC<Props> = ({}) => {
	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#FFFFFF",
			}}>
			<FastImage
				style={{ width: 200, height: 200, marginBottom: 200 }}
				source={{ uri: GIF_URL }}
				defaultSource={require("@main/static/icon/main_icon.png")}
			/>
		</View>
	)
}
