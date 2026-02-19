import type { Task } from "~/shared/types/task"

/**
 * Composable for Bulk Operations
 */
export const useBulkOperations = () => {
	const { $toast } = useNuxtApp()

	const selectedTaskIds = useState<string[]>("bulk-selected-tasks", () => [])
	const isBulkMode = useState<boolean>("bulk-mode", () => false)

	/**
	 * Toggle task selection
	 */
	const toggleSelection = (taskId: string) => {
		const index = selectedTaskIds.value.indexOf(taskId)
		if (index === -1) {
			selectedTaskIds.value.push(taskId)
		} else {
			selectedTaskIds.value.splice(index, 1)
		}
	}

	/**
	 * Select all tasks
	 */
	const selectAll = (taskIds: string[]) => {
		selectedTaskIds.value = [...taskIds]
	}

	/**
	 * Deselect all
	 */
	const deselectAll = () => {
		selectedTaskIds.value = []
	}

	/**
	 * Check if task is selected
	 */
	const isSelected = (taskId: string): boolean => {
		return selectedTaskIds.value.includes(taskId)
	}

	/**
	 * Enable bulk mode
	 */
	const enableBulkMode = () => {
		isBulkMode.value = true
	}

	/**
	 * Disable bulk mode
	 */
	const disableBulkMode = () => {
		isBulkMode.value = false
		deselectAll()
	}

	/**
	 * Bulk update status
	 */
	const bulkUpdateStatus = async (status: Task["status"]) => {
		if (selectedTaskIds.value.length === 0) return false

		const { error } = await useFetch("/api/tasks/bulk-update", {
			method: "POST",
			body: {
				taskIds: selectedTaskIds.value,
				updates: { status },
			},
		})

		if (error.value) {
			$toast.error("Failed to update tasks")
			return false
		}

		$toast.success(`${selectedTaskIds.value.length} tasks updated`)
		disableBulkMode()
		return true
	}

	/**
	 * Bulk assign
	 */
	const bulkAssign = async (assigneeId: string) => {
		if (selectedTaskIds.value.length === 0) return false

		const { error } = await useFetch("/api/tasks/bulk-update", {
			method: "POST",
			body: {
				taskIds: selectedTaskIds.value,
				updates: { assigneeId },
			},
		})

		if (error.value) {
			$toast.error("Failed to assign tasks")
			return false
		}

		$toast.success(`${selectedTaskIds.value.length} tasks assigned`)
		return true
	}

	/**
	 * Bulk set due date
	 */
	const bulkSetDueDate = async (dueDate: string) => {
		if (selectedTaskIds.value.length === 0) return false

		const { error } = await useFetch("/api/tasks/bulk-update", {
			method: "POST",
			body: {
				taskIds: selectedTaskIds.value,
				updates: { dueDate },
			},
		})

		if (error.value) {
			$toast.error("Failed to set due dates")
			return false
		}

		$toast.success(`${selectedTaskIds.value.length} due dates updated`)
		return true
	}

	/**
	 * Bulk add tags
	 */
	const bulkAddTags = async (tags: string[]) => {
		if (selectedTaskIds.value.length === 0) return false

		const { error } = await useFetch("/api/tasks/bulk-update", {
			method: "POST",
			body: {
				taskIds: selectedTaskIds.value,
				updates: { addTags: tags },
			},
		})

		if (error.value) {
			$toast.error("Failed to add tags")
			return false
		}

		$toast.success(`Tags added to ${selectedTaskIds.value.length} tasks`)
		return true
	}

	/**
	 * Bulk archive
	 */
	const bulkArchive = async () => {
		if (selectedTaskIds.value.length === 0) return false

		const { error } = await useFetch("/api/tasks/bulk-archive", {
			method: "POST",
			body: { taskIds: selectedTaskIds.value },
		})

		if (error.value) {
			$toast.error("Failed to archive tasks")
			return false
		}

		$toast.success(`${selectedTaskIds.value.length} tasks archived`)
		disableBulkMode()
		return true
	}

	/**
	 * Bulk delete
	 */
	const bulkDelete = async () => {
		if (selectedTaskIds.value.length === 0) return false

		const confirmed = confirm(`Delete ${selectedTaskIds.value.length} tasks? This cannot be undone.`)
		if (!confirmed) return false

		const { error } = await useFetch("/api/tasks/bulk-delete", {
			method: "POST",
			body: { taskIds: selectedTaskIds.value },
		})

		if (error.value) {
			$toast.error("Failed to delete tasks")
			return false
		}

		$toast.success(`${selectedTaskIds.value.length} tasks deleted`)
		disableBulkMode()
		return true
	}

	return {
		selectedTaskIds: readonly(selectedTaskIds),
		isBulkMode: readonly(isBulkMode),
		selectionCount: computed(() => selectedTaskIds.value.length),
		toggleSelection,
		selectAll,
		deselectAll,
		isSelected,
		enableBulkMode,
		disableBulkMode,
		bulkUpdateStatus,
		bulkAssign,
		bulkSetDueDate,
		bulkAddTags,
		bulkArchive,
		bulkDelete,
	}
}
