import type { Task } from "#shared/types/task"
import { computed, readonly, ref } from "vue"

export function useTaskApi() {
	const { $toast } = useNuxtApp()
	const tasks = useState<Task[]>("tasks", () => [])

	async function createTask(title: string) {
		const { data, error } = await useFetch<Task>("/api/tasks", {
			body: { title },
			method: "POST",
		})

		if (error.value) {
			console.error("Failed to create task:", error.value)
			return
		}

		if (data.value) {
			tasks.value.push(data.value)
			$toast.success("Task created successfully")
		}
	}

	async function deleteTask(taskId: string) {
		const { error } = await useFetch(`/api/tasks/${taskId}`, {
			method: "DELETE",
		})

		if (error.value) {
			console.error("Failed to delete task:", error.value)
			$toast.error("Failed to delete task")
			return
		}

		const index = tasks.value.findIndex((task: Task) => task.id === taskId)
		if (index !== -1) {
			tasks.value.splice(index, 1)
		}

		$toast.success("Task deleted successfully")
	}

	async function updateTask(taskData: Partial<Task>) {
		if (!taskData.id) {
			return
		}

		const taskIndex = tasks.value.findIndex((i: Task) => i.id === taskData.id)
		if (taskIndex === -1) {
			return
		}

		const originalTask = tasks.value[taskIndex]
		if (!originalTask) {
			return
		}

		const updatedTask = { ...originalTask, ...taskData } as Task

		// Optimistic update
		tasks.value[taskIndex] = updatedTask

		const { error } = await useFetch(`/api/tasks/${taskData.id}`, {
			method: "PATCH",
			body: { ...taskData },
		})

		if (error.value) {
			console.error("Failed to update task:", error.value)
			tasks.value[taskIndex] = originalTask // Revert on error
			$toast.error(`Failed to update task ${taskData.id}`)
		} else {
			$toast.success(`Task ${taskData.id} updated successfully`)
		}
	}

	async function updateTaskStatus(taskId: string, status: Task["status"]) {
		const taskIndex = tasks.value.findIndex((i: Task) => i.id === taskId)
		if (taskIndex === -1) {
			return
		}

		const originalTask = tasks.value[taskIndex]
		if (!originalTask) {
			return
		}

		const updatedTask: Task = { ...originalTask, status }

		// Optimistic update
		tasks.value[taskIndex] = updatedTask

		const { error } = await useFetch(`/api/tasks/${taskId}`, {
			body: { status },
			method: "PATCH",
		})

		if (error.value) {
			console.error("Failed to update task status:", error.value)
			if (originalTask) {
				tasks.value[taskIndex] = originalTask // Revert on error
			}

			$toast.error(`Failed to update task ${taskId} status`)
		} else {
			$toast.success(`Task ${taskId} status updated to ${status}`)
		}
	}

	return { createTask, deleteTask, updateTask, updateTaskStatus }
}
