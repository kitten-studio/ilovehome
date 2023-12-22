import React, { FC } from "react"
import { View, Text } from "react-native"

interface Props {
	onPress?: () => void
}

export const NetworkError: FC<Props> = ({ onPress }) => (
	<View
		style={{
			width: "100%",
			height: "100%",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#F3F3F3",
		}}>
		<Text>{process.env.API_HOST}</Text>
		<Text>Network Error...</Text>
	</View>
)
