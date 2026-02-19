import type { List } from "~/shared/types/list"
import type { Task } from "~/shared/types/task"
import { computed, ref } from "vue"

export function useTaskData() {
	const tasks = useState<Task[]>("tasks", () => [])
	const lists = useState<List[]>("lists", () => [])
	const isLoading = useState<boolean>("tasks-loading", () => false)
	const hasFetched = useState<boolean>("tasks-fetched", () => false)

	async function fetchTasks() {
		if (hasFetched.value) {
			return
		}
		isLoading.value = true
		try {
			const data = await $fetch<{ tasks: Task[]; lists: List[] }>("/api/tasks")
			if (data) {
				tasks.value = data.tasks
				lists.value = data.lists
			}
			hasFetched.value = true
		} finally {
			isLoading.value = false
		}
	}

	const totalTasks = computed(() => tasks.value.length)

	const allStatuses = computed(() => [
		...new Set(tasks.value.map(task => task.status)),
	])
	const allAssignees = computed(() => [
		...new Set(tasks.value.map(task => task.assignee?.name).filter(Boolean)),
	])

	const groupByOptions = ref(["status", "assignee", "priority"])
	const fieldOptions = ref(["status", "assignee", "priority", "labels"])

	return {
		tasks,
		lists,
		isLoading,
		hasFetched,
		fetchTasks,
		totalTasks,
		allStatuses,
		allAssignees,
		groupByOptions,
		fieldOptions,
	}
}
