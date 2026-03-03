import type { Store } from "#shared/types"
import { ref } from "vue"

interface OperatingHours {
	[key: string]: {
		open?: string
		close?: string
		isOpen?: boolean
	}
}

interface StoreSettings {
	[key: string]: unknown
}

export const useStores = () => {
	const stores = ref<Store[]>([])
	const store = ref<Store | null>(null)
	const loading = ref(false)

	const fetchStores = async () => {
		loading.value = true
		try {
			// Mock data for now
			// Mock data conforming to the Store and Address types
			const mockAddress: import("#shared/types").Address = {
				id: 1,
				customerId: 1,
				type: "shipping",
				firstName: "Wrikka",
				lastName: "Store",
				addressLine1: "123 Main St",
				city: "Bangkok",
				state: "Bangkok",
				postalCode: "10110",
				country: "Thailand",
				isDefault: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			stores.value = [
				{
					id: "1",
					name: "Main Branch",
					url: "main.wrikka.com",
					currency: "THB",
					address: mockAddress,
					phone: "02-123-4567",
					email: "main@wrikka.com",
					managerId: "101",
					isActive: true,
					timezone: "Asia/Bangkok",
					taxRate: 0.07,
					operatingHours: {} as OperatingHours, // Mocked for simplicity
					settings: {} as StoreSettings, // Mocked for simplicity
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			]
		} catch (error) {
			console.error("Failed to fetch stores:", error)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Fetches a store by ID.
	 *
	 * @param {number} id The ID of the store to fetch.
	 */
	const fetchStore = async (id: number) => {
		loading.value = true
		try {
			// Mock data for now
			// Find the store from the mock data
			const foundStore = stores.value.find(s => s.id === id.toString())
			store.value = foundStore || null
		} catch (error) {
			console.error(`Failed to fetch store ${id}:`, error)
		} finally {
			loading.value = false
		}
	}

	return {
		stores,
		store,
		loading,
		fetchStores,
		fetchStore,
	}
}
