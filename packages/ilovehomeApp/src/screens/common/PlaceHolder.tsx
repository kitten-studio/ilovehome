import React, { FC } from "react"
import { Text, View } from "react-native"
import { Color } from "./Color"

interface PlaceHolderProps {}

export const PlaceHolder: FC<PlaceHolderProps> = ({}) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: Color.orange1,
			}}>
			<Text style={{ color: "#FFFFFF" }}>이 페이지는 아직 작업이 되지 않았습니다.</Text>
		</View>
	)
}

export default PlaceHolder
