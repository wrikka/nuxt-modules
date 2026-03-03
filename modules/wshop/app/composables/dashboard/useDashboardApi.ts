import type { SalesReport } from "#shared/types"
import type { DashboardError } from "./types"

export function useDashboardApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as DashboardError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchStats = async () => {
		try {
			return await $fetch("/api/stats")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch stats"))
		}
	}

	const fetchActivities = async () => {
		try {
			return await $fetch("/api/activities")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to fetch activities"))
		}
	}

	const fetchRealTimeSales = async (
		filters?: { period?: "today" | "week" | "month" | "year"; startDate?: Date; endDate?: Date },
	) => {
		try {
			return await $fetch<SalesReport>("/api/reports/sales/realtime", { query: filters })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load sales data"))
		}
	}

	const fetchTopProducts = async (limit = 10) => {
		try {
			return await $fetch("/api/reports/products/top", { query: { limit } })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load top products"))
		}
	}

	const fetchSalesByCategory = async (period: "today" | "week" | "month" | "year" = "today") => {
		try {
			return await $fetch("/api/reports/sales/by-category", { query: { period } })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load sales by category"))
		}
	}

	const fetchHourlySales = async (date = new Date()) => {
		try {
			return await $fetch("/api/reports/sales/hourly", {
				query: { date: date.toISOString().split("T")[0] },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load hourly sales"))
		}
	}

	const fetchPaymentMethodsSummary = async (
		period: "today" | "week" | "month" | "year" = "today",
	) => {
		try {
			return await $fetch("/api/reports/payments/summary", { query: { period } })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load payment methods summary"))
		}
	}

	const generateSalesReport = async (
		reportConfig: {
			type: "daily" | "weekly" | "monthly" | "yearly"
			startDate: Date
			endDate: Date
			format: "pdf" | "excel"
			includeDetails?: boolean
		},
	) => {
		try {
			return await $fetch("/api/reports/sales/generate", {
				method: "POST",
				body: reportConfig,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Error generating sales report"))
		}
	}

	return {
		fetchStats,
		fetchActivities,
		fetchRealTimeSales,
		fetchTopProducts,
		fetchSalesByCategory,
		fetchHourlySales,
		fetchPaymentMethodsSummary,
		generateSalesReport,
	}
}
