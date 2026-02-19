import type { Category, Customer, POSRegister, POSSession, Product } from "#shared/types"
import type { ProcessSaleData, SalesHistoryParams, SuspendSaleData } from "#shared/types"
import type { PointOfSaleError } from "./types"

export function usePointOfSaleApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as PointOfSaleError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchRegisters = async () => {
		try {
			return await $fetch<POSRegister[]>("/api/pos/registers")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch registers"))
		}
	}

	const fetchCategories = async () => {
		try {
			return await $fetch<Category[]>("/api/categories")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch categories"))
		}
	}

	const fetchProducts = async () => {
		try {
			return await $fetch<Product[]>("/api/products")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch products"))
		}
	}

	const fetchCustomers = async () => {
		try {
			return await $fetch<Customer[]>("/api/customers")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch customers"))
		}
	}

	const updateVariantStock = async (variantId: string, newStock: number) => {
		try {
			// Assuming an endpoint like /api/products/variants/[id] exists for updating a variant
			return await $fetch(`/api/products/variants/${variantId}`, {
				method: "PUT",
				body: { stock: newStock },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to update variant stock"))
		}
	}

	const processSale = async (saleData: ProcessSaleData) => {
		try {
			return await $fetch<POSSession>("/api/pos/sessions", { method: "POST", body: saleData })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to process payment"))
		}
	}

	const suspendSale = async (saleData: SuspendSaleData) => {
		try {
			return await $fetch("/api/pos/suspended-sales", { method: "POST", body: saleData })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to suspend sale"))
		}
	}

	const fetchSuspendedSales = async () => {
		try {
			return await $fetch("/api/pos/suspended-sales")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load suspended sales"))
		}
	}

	const fetchSuspendedSale = async (sessionId: string) => {
		try {
			return await $fetch(`/api/pos/suspended-sales/${sessionId}`)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to resume suspended sale"))
		}
	}

	const closeRegister = async (registerId: string) => {
		try {
			return await $fetch(`/api/pos/registers/${registerId}/close`, {
				method: "PUT",
				body: { closedAt: new Date().toISOString() },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to end shift"))
		}
	}

	const openRegister = async (registerId: string, staffId: string) => {
		try {
			return await $fetch(`/api/pos/registers/${registerId}/open`, {
				method: "PUT",
				body: { currentStaffId: staffId, openedAt: new Date().toISOString() },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to open register"))
		}
	}

	const fetchSalesHistory = async (params: SalesHistoryParams) => {
		try {
			const query = new URLSearchParams(params as Record<string, string>).toString()
			return await $fetch(`/api/pos/sales?${query}`)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to get sales history"))
		}
	}

	return {
		fetchRegisters,
		fetchCategories,
		fetchProducts,
		fetchCustomers,
		updateVariantStock,
		processSale,
		suspendSale,
		fetchSuspendedSales,
		fetchSuspendedSale,
		closeRegister,
		openRegister,
		fetchSalesHistory,
	}
}
