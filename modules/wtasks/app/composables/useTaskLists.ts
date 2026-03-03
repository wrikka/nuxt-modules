import type { Task } from "#shared/types/task"

/**
 * Composable for managing task lists, primarily for grouping tasks based on different criteria.
 */
export const useTaskLists = () => {
	const { filteredTasks } = useTaskFilter()
	const { groupBy } = useView()
	const { isLoading } = useTaskData()

	/**
	 * A computed property that groups the globally filtered tasks based on the current `groupBy` value from `useView`.
	 * ~/returns A record of tasks grouped by status or assignee.
	 */
	const groupedTasks = computed(() => {
		if (groupBy.value === "none") {
			return { "All Tasks": filteredTasks.value }
		}

		return filteredTasks.value.reduce((acc: Record<string, Task[]>, task: Task) => {
			const key = groupBy.value === "status"
				? task.status
				: task.assignee?.name || "Unassigned"
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push(task)
			return acc
		}, {})
	})

	return {
		groupBy,
		groupedTasks,
		tasks: filteredTasks, // The filtered tasks list
		isLoading,
	}
}
