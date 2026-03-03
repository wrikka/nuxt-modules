import type { Task } from "~/shared/types/task"

/**
 * Composable for Task Archival and Search
 */
export const useTaskArchive = () => {
	const { $toast } = useNuxtApp()

	const archivedTasks = useState<Task[]>("archived-tasks", () => [])
	const searchQuery = useState<string>("archive-search-query", () => "")
	const searchResults = useState<Task[]>("archive-search-results", () => [])
	const isSearching = useState<boolean>("archive-searching", () => false)

	/**
	 * Archive completed tasks older than X days
	 */
	const autoArchive = async (daysOld: number = 30) => {
		const { data, error } = await useFetch<{ archivedCount: number }>("/api/tasks/archive", {
			method: "POST",
			body: { daysOld },
		})

		if (error.value) {
			$toast.error("Failed to archive tasks")
			return 0
		}

		$toast.success(`${data.value?.archivedCount || 0} tasks archived`)
		return data.value?.archivedCount || 0
	}

	/**
	 * Archive specific tasks
	 */
	const archiveTasks = async (taskIds: string[]) => {
		const { error } = await useFetch("/api/tasks/archive", {
			method: "POST",
			body: { taskIds },
		})

		if (error.value) {
			$toast.error("Failed to archive tasks")
			return false
		}

		$toast.success(`${taskIds.length} tasks archived`)
		return true
	}

	/**
	 * Restore archived task
	 */
	const restoreTask = async (taskId: string) => {
		const { data, error } = await useFetch<Task>(`/api/tasks/${taskId}/restore`, {
			method: "POST",
		})

		if (error.value || !data.value) {
			$toast.error("Failed to restore task")
			return null
		}

		archivedTasks.value = archivedTasks.value.filter(t => t.id !== taskId)
		$toast.success("Task restored")
		return data.value
	}

	/**
	 * Search archived tasks
	 */
	const searchArchived = async (query: string) => {
		searchQuery.value = query
		isSearching.value = true

		const { data, error } = await useFetch<Task[]>("/api/tasks/search", {
			method: "GET",
			params: {
				q: query,
				archived: "true",
			},
		})

		if (!error.value && data.value) {
			searchResults.value = data.value
		}

		isSearching.value = false
		return searchResults.value
	}

	/**
	 * Full-text search across all tasks
	 */
	const fullTextSearch = async (query: string, includeArchived: boolean = false) => {
		searchQuery.value = query
		isSearching.value = true

		const { data, error } = await useFetch<Task[]>("/api/tasks/search", {
			method: "GET",
			params: {
				q: query,
				archived: includeArchived.toString(),
			},
		})

		if (!error.value && data.value) {
			searchResults.value = data.value
		}

		isSearching.value = false
		return searchResults.value
	}

	/**
	 * Get archived tasks count
	 */
	const getArchivedCount = computed(() => archivedTasks.value.length)

	/**
	 * Permanently delete archived task
	 */
	const permanentlyDelete = async (taskId: string) => {
		const confirmed = confirm("This will permanently delete the task. Continue?")
		if (!confirmed) return false

		const { error } = await useFetch(`/api/tasks/${taskId}/permanent`, {
			method: "DELETE",
		})

		if (error.value) {
			$toast.error("Failed to delete task")
			return false
		}

		archivedTasks.value = archivedTasks.value.filter(t => t.id !== taskId)
		$toast.success("Task permanently deleted")
		return true
	}

	return {
		archivedTasks: readonly(archivedTasks),
		searchQuery,
		searchResults,
		isSearching,
		autoArchive,
		archiveTasks,
		restoreTask,
		searchArchived,
		fullTextSearch,
		getArchivedCount,
		permanentlyDelete,
	}
}
