import type { StockAlert } from "#shared/types"

export const useStockAlerts = () => {
	const stockAlerts = ref<StockAlert[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	const loadStockAlerts = async () => {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<StockAlert[]>("/api/stock/alerts")
			stockAlerts.value = data
		} catch (err) {
			error.value = "Failed to load stock alerts"
			console.error("Error loading stock alerts:", err)
		} finally {
			loading.value = false
		}
	}

	const getLowStockProducts = async (): Promise<StockAlert[]> => {
		try {
			error.value = null
			const response = await $fetch<{ data: StockAlert[] }>("/api/stock/low-stock")
			return response.data
		} catch (err) {
			error.value = "Failed to get low stock products"
			console.error("Error getting low stock products:", err)
			throw err
		}
	}

	const markAlertAsRead = async (alertId: string) => {
		try {
			error.value = null
			await $fetch(`/api/stock/alerts/${alertId}/read`, {
				method: "GET",
			})

			const alert = stockAlerts.value.find(a => a.id === alertId)
			if (alert) {
				alert.isRead = true
			}
		} catch (err) {
			error.value = "Failed to mark alert as read"
			console.error("Error marking alert as read:", err)
			throw err
		}
	}

	const clearError = () => {
		error.value = null
	}

	return {
		stockAlerts: readonly(stockAlerts),
		loading: readonly(loading),
		error: readonly(error),
		loadStockAlerts,
		getLowStockProducts,
		markAlertAsRead,
		clearError,
	}
}
