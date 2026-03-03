import type { Task } from "../../shared/types/task"
import { readonly, ref } from "vue"

export function useTaskDuplication() {
	const isDuplicating = ref(false)

	async function duplicateTask(task: Task, options: {
		includeSubtasks?: boolean
		includeComments?: boolean
		includeAttachments?: boolean
		prefix?: string
	} = {}): Promise<Task> {
		isDuplicating.value = true
		try {
			const { includeSubtasks = true, includeComments = false, includeAttachments = false, prefix = "Copy of" } = options

			const duplicated: Omit<Task, "id"> = {
				title: `${prefix} ${task.title}`,
				description: task.description,
				status: "Backlog",
				tags: [...task.tags],
				date: new Date().toISOString().split("T")[0],
				updatedAt: new Date().toISOString(),
				priority: task.priority,
				assignee: undefined,
				comments: includeComments ? task.comments.map(c => ({
					...c,
					id: crypto.randomUUID(),
				})) : [],
				subtasks: includeSubtasks ? task.subtasks.map(s => ({
					...s,
					id: crypto.randomUUID(),
					completed: false,
				})) : [],
			}

			const response = await $fetch<Task>("/api/tasks", {
				method: "POST",
				body: duplicated,
			})

			return response
		}
		finally {
			isDuplicating.value = false
		}
	}

	async function duplicateTasks(tasks: Task[], options?: Parameters<typeof duplicateTask>[1]): Promise<Task[]> {
		const duplicated: Task[] = []
		for (const task of tasks) {
			const copy = await duplicateTask(task, options)
			duplicated.push(copy)
		}
		return duplicated
	}

	function createTemplate(task: Task, name: string): { name: string, template: Partial<Task> } {
		return {
			name,
			template: {
				title: task.title,
				description: task.description,
				tags: task.tags,
				priority: task.priority,
				subtasks: task.subtasks,
			},
		}
	}

	return {
		isDuplicating: readonly(isDuplicating),
		duplicateTask,
		duplicateTasks,
		createTemplate,
	}
}
