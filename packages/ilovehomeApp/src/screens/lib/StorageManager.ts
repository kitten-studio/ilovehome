import AsyncStorage from "@react-native-async-storage/async-storage"

export class StorageManager {
	static getInstance() {
		if (StorageManager.instance == null) {
			StorageManager.instance = new StorageManager()
			return StorageManager.instance
		}
		return StorageManager.instance
	}
	private static instance: StorageManager | null = null

	async get<T extends object | string>(key: string): Promise<T | null> {
		try {
			const jsonValue = await AsyncStorage.getItem(key)
			return jsonValue != null ? JSON.parse(jsonValue) : null
		} catch (error) {
			console.error(error)
			return null
		}
	}

	async set<T extends object | string>(key: string, value: T): Promise<void> {
		// if (value === null) Promise.reject(new Error("value is null"))
		try {
			const jsonValue = JSON.stringify(value)
			await AsyncStorage.setItem(key, jsonValue)
			return Promise.resolve()
		} catch (error) {
			console.error(error)
			return Promise.reject(error) // reject 호출
		}
	}
	async clear(key: string): Promise<void> {
		try {
			await AsyncStorage.removeItem(key)
		} catch (error) {
			console.error(error)
		}
	}
}
