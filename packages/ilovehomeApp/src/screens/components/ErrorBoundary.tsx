import React from "react"
import { View, Text } from "react-native"

export class ErrorBoundary extends React.Component<{ children: JSX.Element }, { hasError: boolean; error?: Error }> {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error }
	}

	componentDidCatch(error, errorInfo) {
		console.error("[ErrorBoundary] catch error.", error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<View>
					<Text>catch error</Text>
					<Text>{this.state.error?.message}</Text>
				</View>
			)
		}

		return this.props.children
	}
}
