import type { Inventory, Product, StockAlert, StockMovement } from "#shared/types"
import type { InventoryError } from "./types"

export function useInventoryApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as InventoryError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchInventory = async () => {
		try {
			return await $fetch<Inventory[]>("/api/inventory")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load inventory"))
		}
	}

	const fetchProducts = async () => {
		try {
			return await $fetch<Product[]>("/api/products")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load products"))
		}
	}

	const fetchStockMovements = async (productId?: number) => {
		try {
			const url = productId
				? `/api/inventory/movements?productId=${productId}`
				: "/api/inventory/movements"
			return await $fetch<StockMovement[]>(url)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load stock movements"))
		}
	}

	const fetchStockAlerts = async () => {
		try {
			return await $fetch<StockAlert[]>("/api/inventory/alerts")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load stock alerts"))
		}
	}

	const adjustStock = async (
		adjustment: {
			productId: string
			type: "in" | "out" | "adjustment"
			quantity: number
			reason: string
		},
	) => {
		try {
			return await $fetch("/api/inventory/adjust", {
				method: "POST",
				body: adjustment,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to adjust stock"))
		}
	}

	const updateInventoryItem = async (id: number, updates: Partial<Inventory>) => {
		try {
			return await $fetch(`/api/inventory/${id}`, {
				method: "post",
				body: updates,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to update inventory"))
		}
	}

	const bulkUpdateInventory = async (
		updates: Array<{ id: number; updates: Partial<Inventory> }>,
	) => {
		try {
			return await $fetch("/api/inventory/bulk-update", {
				method: "get",
				query: { updates },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to bulk update inventory"))
		}
	}

	const exportInventory = async (format: "csv" | "excel" = "csv") => {
		try {
			return await $fetch(`/api/inventory/export?format=${format}`)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to export inventory"))
		}
	}

	const markAlertAsRead = async (alertId: number) => {
		try {
			return await $fetch(`/api/inventory/alerts/${alertId}/read`, { method: "put" })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to mark alert as read"))
		}
	}

	const dismissAlert = async (alertId: number) => {
		try {
			return await $fetch(`/api/inventory/alerts/${alertId}/dismiss`, { method: "DELETE" })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to dismiss alert"))
		}
	}

	return {
		fetchInventory,
		fetchProducts,
		fetchStockMovements,
		fetchStockAlerts,
		adjustStock,
		updateInventoryItem,
		bulkUpdateInventory,
		exportInventory,
		markAlertAsRead,
		dismissAlert,
	}
}
