import type { Priority, SortBy, Task, TaskFilterState } from "#shared/types/task"
import { computed } from "vue"

export function useTaskFilter() {
	const filter = useState<TaskFilterState>("task-filter", () => ({
		assignee: null,
		searchTerm: "",
		sortBy: "recent" as SortBy,
		status: null,
		list: null,
	}))
	const tasks = useState<Task[]>("tasks", () => [])

	function setStatusFilter(value: Task["status"] | null) {
		filter.value.status = value
	}

	function setAssigneeFilter(value: string | null) {
		filter.value.assignee = value
	}

	function setSortBy(sortBy: SortBy) {
		filter.value.sortBy = sortBy
	}

	function clearFilters() {
		filter.value.searchTerm = ""
		filter.value.status = null
		filter.value.assignee = null
	}

	function setSearchTerm(searchTerm: string) {
		filter.value.searchTerm = searchTerm
	}

	function setListFilter(list: string | null) {
		filter.value.list = list
	}

	const filteredTasks = computed(() => {
		let filtered = tasks.value

		if (filter.value.searchTerm) {
			filtered = filtered.filter(task =>
				task.title
					.toLowerCase()
					.includes(filter.value.searchTerm.toLowerCase())
			)
		}

		if (filter.value.status) {
			filtered = filtered.filter(task => task.status === filter.value.status)
		}

		if (filter.value.assignee) {
			filtered = filtered.filter(
				task => task.assignee?.name === filter.value.assignee,
			)
		}

		const priorityOrder: Record<Priority, number> = {
			High: 3,
			Low: 1,
			Medium: 2,
			None: 0,
			Urgent: 4,
		}

		if (filter.value.sortBy === "recent") {
			filtered.sort(
				(a: Task, b: Task) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
		} else if (filter.value.sortBy === "updated") {
			filtered.sort(
				(a: Task, b: Task) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			)
		} else if (filter.value.sortBy === "priority") {
			filtered.sort(
				(a: Task, b: Task) => priorityOrder[b.priority] - priorityOrder[a.priority],
			)
		}

		return filtered
	})

	const getTasksByStatus = (status: Task["status"]) => {
		return filteredTasks.value.filter(task => task.status === status)
	}

	return {
		filter,
		filteredTasks,
		getTasksByStatus,
		setStatusFilter,
		setAssigneeFilter,
		setSortBy,
		clearFilters,
		setSearchTerm,
		setListFilter,
	}
}
