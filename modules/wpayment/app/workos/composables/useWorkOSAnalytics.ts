import type { AnalyticsData } from "../shared/types/advanced"

export const useWorkOSAnalytics = () => {
	const getAnalytics = async (organizationId?: string, dateRange?: {
		startDate: string
		endDate: string
	}): Promise<AnalyticsData> => {
		const params = new URLSearchParams()
		if (organizationId) params.append("organizationId", organizationId)
		if (dateRange) {
			params.append("startDate", dateRange.startDate)
			params.append("endDate", dateRange.endDate)
		}

		return await $fetch(`/api/workos/analytics?${params.toString()}`)
	}

	return {
		getAnalytics,
	}
}
