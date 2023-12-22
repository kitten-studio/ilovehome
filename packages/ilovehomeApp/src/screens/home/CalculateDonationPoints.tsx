import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { View, StyleSheet, Text } from "react-native"
import Topbar from "../components/Topbar"
import { Input } from "@ui-kitten/components"
import { useStore } from "../lib/Zustand"
import { countDigits, numberWithCommas } from "../common/StringUtils"

export const CalculateDonationPoints = forwardRef<CalculateDonationPointsRef, CalculateDonationPointsProps>((props, ref) => {
	const { isShow } = props
	const bottomSheetRef = useRef<BottomSheet>(null)

	const { isCalculateDonationPoints, update } = useStore((state) => ({
		isCalculateDonationPoints: state.homeScreen.isCalculateDonationPoints,
		update: state.update,
	}))

	// variables
	const snapPoints = useMemo(() => ["45%"], [])
	const [value, setValue] = React.useState("")

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0} // 이거 추가
				disappearsOnIndex={-1} // 이거 추가
				pressBehavior="close"
			/>
		),
		[]
	)

	useEffect(() => {
		if (isShow) {
			bottomSheetRef.current?.expand()
		} else {
			bottomSheetRef.current?.close()
		}
	}, [isShow])

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {}, [])

	const show = useCallback(() => {
		bottomSheetRef.current?.expand()
	}, [])

	const hide = useCallback(() => {
		bottomSheetRef.current?.close()
	}, [])

	useImperativeHandle(
		ref,
		() => ({
			show,
			hide,
		}),
		[hide, show]
	)

	return (
		<>
			{isShow && (
				<BottomSheet
					onClose={() => {
						update("homeScreen", { isCalculateDonationPoints: false })
					}}
					ref={bottomSheetRef}
					enableOverDrag={true}
					enablePanDownToClose={true}
					index={0}
					snapPoints={snapPoints}
					backdropComponent={renderBackdrop}
					onChange={handleSheetChanges}>
					<View style={styles.contentContainer}>
						<Topbar title={"기부 포인트 계산기"} />
						<View
							style={{
								width: "100%",
								height: 200,

								justifyContent: "center",
								alignItems: "center",
							}}>
							<View style={{ width: 200, justifyContent: "center", alignItems: "center" }}>
								<View
									style={{
										width: 200,
										justifyContent: "center",
										alignItems: "center",
										marginVertical: 11,
									}}>
									<Text style={{ fontStyle: "normal", fontWeight: "700", fontSize: 15 }}>기부 포인트 (P)</Text>
								</View>
								<View
									style={{
										width: 300,
										justifyContent: "center",
										alignItems: "center",
										marginTop: 11,
									}}>
									<Input
										keyboardType="numeric"
										placeholder="기부금 포인트 입력"
										value={value}
										onChangeText={(nextValue) => setValue(nextValue)}
									/>
								</View>
							</View>
							<View style={{ width: 200, justifyContent: "center", alignItems: "center" }}>
								<View
									style={{
										width: 200,
										justifyContent: "center",
										alignItems: "center",
										marginVertical: 11,
									}}>
									<Text style={{ fontStyle: "normal", fontWeight: "700", fontSize: 15 }}>기부금 (원)</Text>
								</View>
								<View
									style={{
										width: 300,
										height: 35,
										justifyContent: "center",
										alignItems: "flex-start",
										borderWidth: 1,
									}}>
									<Text
										style={{
											fontStyle: "normal",
											fontWeight: "700",
											fontSize: 15,
											paddingLeft: 15,
										}}>
										{`${numberWithCommas(countDigits((Number(value) * 10) / 3))} 원`}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</BottomSheet>
			)}
		</>
	)
})

export interface CalculateDonationPointsRef {
	show: () => void
	hide: () => void
}

type CalculateDonationPointsProps = {
	isShow: boolean
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
})
