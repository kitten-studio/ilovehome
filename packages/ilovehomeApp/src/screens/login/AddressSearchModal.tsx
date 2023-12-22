import { AppStackParamList } from "@main/@types/params"
import { StackScreenProps } from "@react-navigation/stack"
import Topbar from "ilovehomeApp/src/screens/components/Topbar"
import React, { FC, useEffect } from "react"
import { ScrollView, StatusBar } from "react-native"
import Postcode from "@actbase/react-daum-postcode"
import { ViewDimension } from "../lib/ViewDimension"

export type AddressSearchProps = {
	onAddressSelected?: (roadAddress: string) => void
}

type AddressSearchModalProps = StackScreenProps<AppStackParamList, "AddressSearchModal"> & AddressSearchProps

const WIDTH = ViewDimension.get().width

const AddressSearchModal: FC<AddressSearchModalProps> = ({ navigation, route }) => {
	useEffect(() => {
		StatusBar.setBackgroundColor("#ffffff")
	})

	return (
		<>
			<Topbar title={"주소 검색"} isClose />
			<Postcode
				style={{ width: WIDTH, height: 500 }}
				jsOptions={{ animation: true }}
				onSelected={(data) => {
					route.params?.onAddressSelected?.(data.roadAddress)
					navigation.goBack()
				}}
				onError={(e) => {}}
			/>
		</>
	)
}

export default AddressSearchModal
