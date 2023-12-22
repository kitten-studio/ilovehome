import * as eva from "@eva-design/eva"
import { initializeStore, Provider } from "@main/screens/lib/Zustand"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApplicationProvider } from "@ui-kitten/components"
import { ErrorBoundary } from "ilovehomeApp/src/screens/components/ErrorBoundary"
import { loginStore } from "ilovehomeApp/src/screens/lib/account/LoginStore"
import React, { useCallback, useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Toast, { BaseToast } from "react-native-toast-message"
import { MainNavigator } from "./navigator/Navigator"
import _ from "lodash"

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
			cacheTime: 0,
		},
	},
})
loginStore.initStore({ clientId: "ilovehome" })

const App: () => JSX.Element = () => {
	const createStore = useCallback(() => initializeStore(), [])

	const toastConfig = {
		success: (props) => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: "blue" }}
				contentContainerStyle={{ paddingHorizontal: 15 }}
				text1Style={{
					fontSize: 15,
					fontWeight: "400",
				}}
			/>
		),
	}

	return (
		<>
			<Provider createStore={createStore}>
				<ErrorBoundary>
					<ApplicationProvider {...eva} theme={eva.light}>
						<QueryClientProvider client={queryClient}>
							<SafeAreaProvider>
								<NavigationContainer>
									<MainNavigator />
								</NavigationContainer>
							</SafeAreaProvider>
						</QueryClientProvider>
					</ApplicationProvider>
				</ErrorBoundary>
			</Provider>
			<Toast config={toastConfig} />
		</>
	)
}

export default App
