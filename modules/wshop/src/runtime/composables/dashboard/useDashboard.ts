import { onMounted, onUnmounted, ref } from "vue"
import { useDashboardApi } from "./useDashboardApi"

export const useDashboard = () => {
	const {
		fetchStats,
		fetchActivities,
		fetchRealTimeSales,
		fetchTopProducts,
		fetchSalesByCategory,
		fetchHourlySales,
		fetchPaymentMethodsSummary,
		generateSalesReport,
	} = useDashboardApi()

	const { data: stats, pending: statsPending, error: statsError, refresh: refreshStats } =
		useAsyncData(fetchStats)
	const {
		data: recentActivities,
		pending: activitiesPending,
		error: activitiesError,
		refresh: refreshActivities,
	} = useAsyncData(fetchActivities)

	const salesFilters = ref<
		{ period?: "today" | "week" | "month" | "year"; startDate?: Date; endDate?: Date }
	>({ period: "today" })

	const {
		data: salesData,
		pending: salesPending,
		error: salesError,
		refresh: refreshSales,
	} = useAsyncData(
		"salesData",
		() => fetchRealTimeSales(salesFilters.value),
		{ watch: [salesFilters] },
	)

	const loadRealTimeSales = (
		filters?: { period?: "today" | "week" | "month" | "year"; startDate?: Date; endDate?: Date },
	) => {
		salesFilters.value = filters || { period: "today" }
	}

	const autoRefreshInterval = ref<NodeJS.Timeout | null>(null)

	const startAutoRefresh = (interval = 30000) => {
		stopAutoRefresh()
		autoRefreshInterval.value = setInterval(() => {
			refreshSales()
			refreshStats()
			refreshActivities()
		}, interval)
	}

	const stopAutoRefresh = () => {
		if (autoRefreshInterval.value) {
			clearInterval(autoRefreshInterval.value)
			autoRefreshInterval.value = null
		}
	}

	onMounted(() => {
		// Initial load is handled by useAsyncData
		startAutoRefresh()
	})

	onUnmounted(stopAutoRefresh)

	return {
		stats,
		statsPending,
		statsError,
		recentActivities,
		activitiesPending,
		activitiesError,
		refreshStats,
		refreshActivities,
		salesData,
		salesPending,
		salesError,
		refreshSales,
		loadRealTimeSales,
		loadSalesSummary: (period: "today" | "week" | "month" | "year" = "today") =>
			loadRealTimeSales({ period }),
		loadTopProducts: fetchTopProducts,
		loadSalesByCategory: fetchSalesByCategory,
		loadHourlySales: fetchHourlySales,
		loadPaymentMethodsSummary: fetchPaymentMethodsSummary,
		generateSalesReport,
		startAutoRefresh,
		stopAutoRefresh,
	}
}
