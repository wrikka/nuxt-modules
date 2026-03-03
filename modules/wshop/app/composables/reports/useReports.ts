import { useFetch } from "#imports"
import type { CustomerStats, SalesSummary, TopProduct } from "#shared/types"

export const useReports = () => {
	// Fetch all reports data in parallel
	const { data: summary, pending: summaryPending, error: summaryError } = useFetch<SalesSummary>(
		"/api/reports/sales-summary",
	)
	const { data: topProducts, pending: topProductsPending, error: topProductsError } = useFetch<
		TopProduct[]
	>("/api/reports/top-products")
	const { data: customerStats, pending: customerStatsPending, error: customerStatsError } =
		useFetch<CustomerStats>("/api/reports/customer-stats")

	// Combine pending states
	const pending = computed(() =>
		summaryPending.value || topProductsPending.value || customerStatsPending.value
	)

	// Combine errors
	const error = computed(() =>
		summaryError.value || topProductsError.value || customerStatsError.value
	)

	return {
		// Data
		summary,
		topProducts,
		customerStats,

		// State
		pending,
		summaryPending,
		topProductsPending,
		customerStatsPending,
		error,
	}
}
