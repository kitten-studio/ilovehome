import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react"
import { Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export interface DefaultModalRef {
	show: () => void
	hide: () => void
}

type DefaultModalProps = {}

const DefaultModal = forwardRef<DefaultModalRef, DefaultModalProps>((props, ref) => {
	const {} = props

	const [isVisible, setIsVisible] = useState(false)

	const show = useCallback(() => setIsVisible(true), [])

	const hide = useCallback(() => setIsVisible(false), [])

	const handleAccept = () => {}

	useImperativeHandle(ref, () => ({
		show,
		hide,
	}))

	return (
		<Modal visible={isVisible} animationType="fade" transparent>
			<View style={styles.container}>
				<StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" translucent={false} />
				<View style={styles.modal}>
					<Text style={styles.title}>Promotion Inducement</Text>
					<Text style={styles.message}>Do you want to receive special offers and promotions from us?</Text>
					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							onPress={() => {
								hide()
							}}>
							<Text style={styles.cancel}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleAccept}>
							<Text style={styles.accept}>Accept</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	modal: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	message: {
		fontSize: 16,
		marginBottom: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	cancel: {
		fontSize: 16,
		color: "gray",
		marginRight: 10,
	},
	accept: {
		fontSize: 16,
		color: "blue",
	},
})

export default DefaultModal
