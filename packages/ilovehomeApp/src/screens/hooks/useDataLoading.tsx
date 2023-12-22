import { FetchDataLoading } from "@main/@types/fetch"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useQuery } from "@tanstack/react-query"
import api from "../lib/api/api"

export function useDataLoadingWith<T>(fetchDataLoading: FetchDataLoading) {
	const { isLoading, isError, error, data, refetch } = useQuery({
		queryKey: fetchDataLoading.queryKey,
		queryFn: async () => {
			return api.post<T>(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data).then((res) => res.data)
		},
	})

	return {
		data,
		isLoading,
		isError,
		error,
		refetch,
	}
}

export const useDataLoading = (fetchDataLoading: FetchDataLoading, navigation?: NativeStackNavigationProp<ParamListBase>) => {
	const { isLoading, isError, error, data } = useQuery({
		queryKey: fetchDataLoading.queryKey,
		queryFn: async () => {
			return api.post(`${process.env.API_HOST}/${fetchDataLoading.url}`, fetchDataLoading.data).then((res) => res.data)
		},
	})

	return {
		data,
		isLoading,
		isError,
		error,
	}
}
