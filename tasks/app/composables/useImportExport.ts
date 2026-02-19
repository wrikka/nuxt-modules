/**
 * Composable for Import/Export
 */
export const useImportExport = () => {
	const { $toast } = useNuxtApp()

	const isImporting = useState<boolean>("importing", () => false)
	const importProgress = useState<number>("import-progress", () => 0)
	const importResults = useState<{ success: number; failed: number; errors: string[] }>("import-results", () => ({
		success: 0,
		failed: 0,
		errors: [],
	}))

	/**
	 * Export tasks to CSV
	 */
	const exportToCSV = async (taskIds?: string[]) => {
		const { data, error } = await useFetch<string>("/api/export/csv", {
			method: "POST",
			body: { taskIds },
		})

		if (error.value || !data.value) {
			$toast.error("Failed to export tasks")
			return
		}

		// Download file
		const blob = new Blob([data.value], { type: "text/csv" })
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = `tasks-${new Date().toISOString().split("T")[0]}.csv`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)

		$toast.success("Tasks exported to CSV")
	}

	/**
	 * Export tasks to PDF
	 */
	const exportToPDF = async (taskIds?: string[]) => {
		const { data, error } = await useFetch<string>("/api/export/pdf", {
			method: "POST",
			body: { taskIds },
		})

		if (error.value || !data.value) {
			$toast.error("Failed to export tasks")
			return
		}

		window.open(data.value, "_blank")
		$toast.success("PDF report generated")
	}

	/**
	 * Import from CSV
	 */
	const importFromCSV = async (file: File) => {
		isImporting.value = true
		importProgress.value = 0
		importResults.value = { success: 0, failed: 0, errors: [] }

		const formData = new FormData()
		formData.append("file", file)

		try {
			const { data, error } = await useFetch<{ success: number; failed: number; errors: string[] }>("/api/import/csv", {
				method: "POST",
				body: formData,
			})

			if (error.value || !data.value) {
				$toast.error("Failed to import tasks")
				return null
			}

			importResults.value = data.value
			$toast.success(`Imported ${data.value.success} tasks`)
			return data.value
		} finally {
			isImporting.value = false
		}
	}

	/**
	 * Import from JSON
	 */
	const importFromJSON = async (jsonData: string) => {
		isImporting.value = true

		try {
			const { data, error } = await useFetch<{ success: number; failed: number }>("/api/import/json", {
				method: "POST",
				body: { data: JSON.parse(jsonData) },
			})

			if (error.value || !data.value) {
				$toast.error("Failed to import tasks")
				return null
			}

			$toast.success(`Imported ${data.value.success} tasks`)
			return data.value
		} catch (e) {
			$toast.error("Invalid JSON format")
			return null
		} finally {
			isImporting.value = false
		}
	}

	/**
	 * Import from external service
	 */
	const importFromService = async (service: "trello" | "asana" | "jira", apiKey: string) => {
		isImporting.value = true

		try {
			const { data, error } = await useFetch<{ success: number; failed: number }>(`/api/import/${service}`, {
				method: "POST",
				body: { apiKey },
			})

			if (error.value || !data.value) {
				$toast.error(`Failed to import from ${service}`)
				return null
			}

			$toast.success(`Imported ${data.value.success} tasks from ${service}`)
			return data.value
		} finally {
			isImporting.value = false
		}
	}

	/**
	 * Parse CSV preview
	 */
	const parseCSVPreview = async (file: File): Promise<string[][]> => {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = (e) => {
				const text = e.target?.result as string
				const lines = text.split("\n").slice(0, 5) // Preview first 5 rows
				resolve(lines.map(line => line.split(",")))
			}
			reader.readAsText(file)
		})
	}

	return {
		isImporting,
		importProgress,
		importResults,
		exportToCSV,
		exportToPDF,
		importFromCSV,
		importFromJSON,
		importFromService,
		parseCSVPreview,
	}
}
