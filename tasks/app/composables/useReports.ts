import type { Report } from "~/shared/types/features"

/**
 * Composable for Advanced Reports Builder
 */
export const useReports = () => {
	const { $toast } = useNuxtApp()

	const reports = useState<Report[]>("reports", () => [])
	const selectedReport = useState<Report | null>("selected-report", () => null)
	const isBuilderOpen = useState<boolean>("report-builder-open", () => false)

	/**
	 * Fetch reports
	 */
	const fetchReports = async () => {
		const { data } = await useFetch<Report[]>("/api/reports")
		if (data.value) reports.value = data.value
	}

	/**
	 * Create report
	 */
	const createReport = async (reportData: Omit<Report, "id" | "createdAt">) => {
		const { data, error } = await useFetch<Report>("/api/reports", {
			method: "POST",
			body: reportData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create report")
			return null
		}

		reports.value.push(data.value)
		$toast.success("Report created")
		return data.value
	}

	/**
	 * Update report
	 */
	const updateReport = async (reportId: string, updates: Partial<Report>) => {
		const { data, error } = await useFetch<Report>(`/api/reports/${reportId}`, {
			method: "PATCH",
			body: updates,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to update report")
			return false
		}

		const index = reports.value.findIndex(r => r.id === reportId)
		if (index !== -1) reports.value[index] = data.value
		return true
	}

	/**
	 * Delete report
	 */
	const deleteReport = async (reportId: string) => {
		const { error } = await useFetch(`/api/reports/${reportId}`, { method: "DELETE" })

		if (error.value) {
			$toast.error("Failed to delete report")
			return false
		}

		reports.value = reports.value.filter(r => r.id !== reportId)
		$toast.success("Report deleted")
		return true
	}

	/**
	 * Generate report data
	 */
	const generateReport = async (reportId: string) => {
		const { data, error } = await useFetch<Record<string, unknown>>(`/api/reports/${reportId}/generate`)

		if (error.value) {
			$toast.error("Failed to generate report")
			return null
		}

		return data.value
	}

	/**
	 * Export report to PDF
	 */
	const exportToPDF = async (reportId: string) => {
		const { data } = await useFetch<string>(`/api/reports/${reportId}/export/pdf`)
		if (data.value) {
			window.open(data.value, "_blank")
		}
	}

	/**
	 * Open report builder
	 */
	const openBuilder = (report?: Report) => {
		selectedReport.value = report || null
		isBuilderOpen.value = true
	}

	/**
	 * Close report builder
	 */
	const closeBuilder = () => {
		isBuilderOpen.value = false
		selectedReport.value = null
	}

	return {
		reports: readonly(reports),
		selectedReport,
		isBuilderOpen,
		fetchReports,
		createReport,
		updateReport,
		deleteReport,
		generateReport,
		exportToPDF,
		openBuilder,
		closeBuilder,
	}
}
