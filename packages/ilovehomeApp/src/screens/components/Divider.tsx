import React, { FC } from "react"
import { View, Image, Text, TouchableOpacity } from "react-native"
import { Color } from "../common/Color"

interface DividerProps {
	color?: Color
}

const Divider: FC<DividerProps> = (props) => {
	const { color } = props
	return (
		<View
			style={{
				width: "100%",
				backgroundColor: color === undefined ? "#D0D0D0" : color,
				height: 1,
			}}
		/>
	)
}

export default Divider
