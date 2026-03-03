import type { Task, TaskFilterState, SearchFilter, SearchOperator } from "~/shared/types/task"

export interface TableColumn {
	key: string
	label: string
	width?: number
	sortable?: boolean
	filterable?: boolean
	visible?: boolean
}

export interface TableRow {
	task: Task
	selected: boolean
	expanded: boolean
}

/**
 * Composable for managing table view functionality
 */
export const useTable = () => {
	const tasks = useState<Task[]>("tasks", () => [])
	const selectedTaskIds = ref<Set<string>>(new Set())
	const expandedTaskIds = ref<Set<string>>(new Set())
	const sortColumn = ref<string>("dueDate")
	const sortDirection = ref<"asc" | "desc">("desc")

	/**
	 * Default table columns
	 */
	const defaultColumns: TableColumn[] = [
		{ key: "title", label: "Title", width: 300, sortable: true, filterable: true, visible: true },
		{ key: "status", label: "Status", width: 120, sortable: true, filterable: true, visible: true },
		{ key: "priority", label: "Priority", width: 100, sortable: true, filterable: true, visible: true },
		{ key: "assignee", label: "Assignee", width: 150, sortable: true, filterable: true, visible: true },
		{ key: "dueDate", label: "Due Date", width: 120, sortable: true, filterable: true, visible: true },
		{ key: "tags", label: "Tags", width: 200, sortable: false, filterable: true, visible: true },
		{ key: "progress", label: "Progress", width: 100, sortable: true, filterable: false, visible: false },
		{ key: "timeTracking", label: "Time", width: 100, sortable: true, filterable: false, visible: false },
		{ key: "createdAt", label: "Created", width: 120, sortable: true, filterable: false, visible: false },
		{ key: "updatedAt", label: "Updated", width: 120, sortable: true, filterable: false, visible: false },
	]

	const columns = ref<TableColumn[]>([...defaultColumns])
	const visibleColumns = computed(() => columns.value.filter((c) => c.visible))

	/**
	 * Toggle column visibility
	 */
	const toggleColumn = (key: string) => {
		const column = columns.value.find((c) => c.key === key)
		if (column) {
			column.visible = !column.visible
		}
	}

	/**
	 * Set column visibility
	 */
	const setColumnVisibility = (key: string, visible: boolean) => {
		const column = columns.value.find((c) => c.key === key)
		if (column) {
			column.visible = visible
		}
	}

	/**
	 * Sort tasks by column
	 */
	const sortBy = (columnKey: string) => {
		if (sortColumn.value === columnKey) {
			sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc"
		} else {
			sortColumn.value = columnKey
			sortDirection.value = "asc"
		}
	}

	/**
	 * Get sorted and filtered tasks
	 */
	const sortedTasks = computed(() => {
		let sorted = [...tasks.value]

		sorted.sort((a: Task, b: Task) => {
			let aValue: unknown
			let bValue: unknown

			switch (sortColumn.value) {
				case "title":
					aValue = a.title
					bValue = b.title
					break
				case "status":
					aValue = a.status
					bValue = b.status
					break
				case "priority": {
					const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1, None: 0 }
					aValue = priorityOrder[a.priority]
					bValue = priorityOrder[b.priority]
					break
				}
				case "assignee":
					aValue = a.assignee?.name || ""
					bValue = b.assignee?.name || ""
					break
				case "dueDate":
					aValue = a.dueDate || ""
					bValue = b.dueDate || ""
					break
				case "createdAt":
					aValue = a.createdAt
					bValue = b.createdAt
					break
				case "updatedAt":
					aValue = a.updatedAt
					bValue = b.updatedAt
					break
				case "progress":
					aValue = a.progress || 0
					bValue = b.progress || 0
					break
				case "timeTracking":
					aValue = a.actualTime || 0
					bValue = b.actualTime || 0
					break
				default:
					return 0
			}

			if (aValue === bValue) return 0
			const comparison = aValue < bValue ? -1 : 1
			return sortDirection.value === "asc" ? comparison : -comparison
		})

		return sorted
	})

	/**
	 * Table rows with selection state
	 */
	const tableRows = computed<TableRow[]>(() => {
		return sortedTasks.value.map((task) => ({
			task,
			selected: selectedTaskIds.value.has(task.id),
			expanded: expandedTaskIds.value.has(task.id),
		}))
	})

	/**
	 * Selection functions
	 */
	const selectTask = (taskId: string) => {
		selectedTaskIds.value.add(taskId)
	}

	const deselectTask = (taskId: string) => {
		selectedTaskIds.value.delete(taskId)
	}

	const toggleSelection = (taskId: string) => {
		if (selectedTaskIds.value.has(taskId)) {
			selectedTaskIds.value.delete(taskId)
		} else {
			selectedTaskIds.value.add(taskId)
		}
	}

	const selectAll = () => {
		sortedTasks.value.forEach((task) => selectedTaskIds.value.add(task.id))
	}

	const deselectAll = () => {
		selectedTaskIds.value.clear()
	}

	const isAllSelected = computed(() => {
		return sortedTasks.value.length > 0 && sortedTasks.value.every((task) => selectedTaskIds.value.has(task.id))
	})

	const isIndeterminate = computed(() => {
		const selectedCount = selectedTaskIds.value.size
		return selectedCount > 0 && selectedCount < sortedTasks.value.length
	})

	/**
	 * Expansion functions
	 */
	const expandTask = (taskId: string) => {
		expandedTaskIds.value.add(taskId)
	}

	const collapseTask = (taskId: string) => {
		expandedTaskIds.value.delete(taskId)
	}

	const toggleExpansion = (taskId: string) => {
		if (expandedTaskIds.value.has(taskId)) {
			expandedTaskIds.value.delete(taskId)
		} else {
			expandedTaskIds.value.add(taskId)
		}
	}

	/**
	 * Bulk actions
	 */
	const bulkUpdateStatus = async (status: Task["status"]) => {
		const ids = Array.from(selectedTaskIds.value)
		if (ids.length === 0) return

		// Update all selected tasks
		for (const taskId of ids) {
			await useFetch(`/api/tasks/${taskId}`, {
				method: "PATCH",
				body: { status },
			})
		}

		// Refresh tasks
		await refreshNuxtData("tasks")
	}

	const bulkDelete = async () => {
		const ids = Array.from(selectedTaskIds.value)
		if (ids.length === 0) return

		if (!confirm(`Delete ${ids.length} tasks?`)) return

		for (const taskId of ids) {
			await useFetch(`/api/tasks/${taskId}`, {
				method: "DELETE",
			})
		}

		selectedTaskIds.value.clear()
		await refreshNuxtData("tasks")
	}

	/**
	 * Get cell value for display
	 */
	const getCellValue = (task: Task, columnKey: string): string => {
		switch (columnKey) {
			case "title":
				return task.title
			case "status":
				return task.status
			case "priority":
				return task.priority
			case "assignee":
				return task.assignee?.name || "Unassigned"
			case "dueDate":
				return task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"
			case "tags":
				return task.tags?.map((t) => t.name).join(", ") || "-"
			case "progress":
				return `${task.progress || 0}%`
			case "timeTracking":
				if (!task.actualTime) return "-"
				const hours = Math.floor((task.actualTime || 0) / 60)
				const mins = (task.actualTime || 0) % 60
				return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
			case "createdAt":
				return new Date(task.createdAt).toLocaleDateString()
			case "updatedAt":
				return new Date(task.updatedAt).toLocaleDateString()
			default:
				return "-"
		}
	}

	return {
		columns: readonly(columns),
		visibleColumns: readonly(visibleColumns),
		sortColumn: readonly(sortColumn),
		sortDirection: readonly(sortDirection),
		sortedTasks: readonly(sortedTasks),
		tableRows: readonly(tableRows),
		selectedTaskIds: readonly(selectedTaskIds),
		expandedTaskIds: readonly(expandedTaskIds),
		isAllSelected: readonly(isAllSelected),
		isIndeterminate: readonly(isIndeterminate),
		toggleColumn,
		setColumnVisibility,
		sortBy,
		selectTask,
		deselectTask,
		toggleSelection,
		selectAll,
		deselectAll,
		expandTask,
		collapseTask,
		toggleExpansion,
		bulkUpdateStatus,
		bulkDelete,
		getCellValue,
	}
}
