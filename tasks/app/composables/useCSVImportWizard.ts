import { readonly, ref } from "vue"

export interface CSVColumn {
	name: string
	index: number
	sample: string
}

export interface ColumnMapping {
	csvColumn: string
	taskField: string
}

export function useCSVImportWizard() {
	const isUploading = ref(false)
	const columns = ref<CSVColumn[]>([])
	const mappings = ref<ColumnMapping[]>([])
	const preview = ref<Record<string, string>[]>([])

	const availableFields = [
		{ value: "title", label: "Title", required: true },
		{ value: "description", label: "Description", required: false },
		{ value: "status", label: "Status", required: false },
		{ value: "priority", label: "Priority", required: false },
		{ value: "date", label: "Due Date", required: false },
		{ value: "assignee", label: "Assignee", required: false },
		{ value: "tags", label: "Tags", required: false },
		{ value: "list", label: "List", required: false },
	]

	async function parseCSV(file: File): Promise<void> {
		isUploading.value = true
		try {
			const text = await file.text()
			const lines = text.split("\n").filter(line => line.trim())

			if (lines.length < 2) {
				throw new Error("CSV must have at least a header row and one data row")
			}

			// Parse headers
			const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""))

			// Get sample data
			columns.value = headers.map((name, index) => ({
				name,
				index,
				sample: lines[1]?.split(",")[index]?.trim().replace(/^["']|["']$/g, "") || "",
			}))

			// Auto-detect mappings based on column names
			mappings.value = columns.value
				.map(col => {
					const field = availableFields.find(f =>
						col.name.toLowerCase().includes(f.value.toLowerCase()) ||
						f.value.toLowerCase().includes(col.name.toLowerCase()),
					)
					return field
						? { csvColumn: col.name, taskField: field.value }
						: { csvColumn: col.name, taskField: "" }
				})
				.filter(m => m.taskField)

			// Generate preview
			preview.value = lines.slice(1, 6).map(line => {
				const values = line.split(",").map(v => v.trim().replace(/^["']|["']$/g, ""))
				const row: Record<string, string> = {}
				headers.forEach((header, i) => {
					row[header] = values[i] || ""
				})
				return row
			})
		}
		finally {
			isUploading.value = false
		}
	}

	function setMapping(csvColumn: string, taskField: string): void {
		const existing = mappings.value.find(m => m.csvColumn === csvColumn)
		if (existing) {
			existing.taskField = taskField
		}
		else {
			mappings.value.push({ csvColumn, taskField })
		}
	}

	function removeMapping(csvColumn: string): void {
		mappings.value = mappings.value.filter(m => m.csvColumn !== csvColumn)
	}

	async function importTasks(file: File): Promise<{ success: number, failed: number }> {
		const text = await file.text()
		const lines = text.split("\n").filter(line => line.trim())
		const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""))

		let success = 0
		let failed = 0

		for (const line of lines.slice(1)) {
			const values = line.split(",").map(v => v.trim().replace(/^["']|["']$/g, ""))
			const taskData: Record<string, string> = {}

			for (const mapping of mappings.value) {
				const colIndex = headers.indexOf(mapping.csvColumn)
				if (colIndex !== -1) {
					taskData[mapping.taskField] = values[colIndex]
				}
			}

			try {
				await $fetch("/api/tasks", {
					method: "POST",
					body: taskData,
				})
				success++
			}
			catch {
				failed++
			}
		}

		return { success, failed }
	}

	function reset(): void {
		columns.value = []
		mappings.value = []
		preview.value = []
	}

	return {
		isUploading: readonly(isUploading),
		columns,
		mappings,
		preview,
		availableFields: readonly(availableFields),
		parseCSV,
		setMapping,
		removeMapping,
		importTasks,
		reset,
	}
}
