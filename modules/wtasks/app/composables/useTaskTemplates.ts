import type { TaskTemplate } from "~/shared/types/features"
import type { Task } from "~/shared/types/task"

/**
 * Composable for Task Templates
 */
export const useTaskTemplates = () => {
	const { $toast } = useNuxtApp()

	const templates = useState<TaskTemplate[]>("task-templates", () => [])
	const selectedTemplate = useState<TaskTemplate | null>("selected-template", () => null)

	/**
	 * Fetch templates
	 */
	const fetchTemplates = async () => {
		const { data } = await useFetch<TaskTemplate[]>("/api/templates")
		if (data.value) templates.value = data.value
	}

	/**
	 * Create template from task
	 */
	const createFromTask = async (task: Task, name: string, description: string) => {
		const templateData = {
			name,
			description,
			template: {
				title: task.title,
				description: task.description || "",
				priority: task.priority,
				tags: task.tags.map(t => t.name),
				subtasks: task.subtasks.map(st => ({ title: st.title })),
			},
		}

		const { data, error } = await useFetch<TaskTemplate>("/api/templates", {
			method: "POST",
			body: templateData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create template")
			return null
		}

		templates.value.push(data.value)
		$toast.success("Template created")
		return data.value
	}

	/**
	 * Apply template to create new task
	 */
	const applyTemplate = async (templateId: string, overrides: Partial<Task> = {}) => {
		const template = templates.value.find(t => t.id === templateId)
		if (!template) return null

		const taskData = {
			title: template.template.title,
			description: template.template.description,
			priority: template.template.priority,
			tags: template.template.tags.map(name => ({ name, color: "#94a3b8" })),
			subtasks: template.template.subtasks.map(st => ({
				id: crypto.randomUUID(),
				title: st.title,
				completed: false,
			})),
			status: "Backlog" as const,
			...overrides,
		}

		const { data, error } = await useFetch<Task>("/api/tasks", {
			method: "POST",
			body: taskData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create task from template")
			return null
		}

		$toast.success("Task created from template")
		return data.value
	}

	/**
	 * Delete template
	 */
	const deleteTemplate = async (templateId: string) => {
		const { error } = await useFetch(`/api/templates/${templateId}`, { method: "DELETE" })

		if (error.value) {
			$toast.error("Failed to delete template")
			return false
		}

		templates.value = templates.value.filter(t => t.id !== templateId)
		$toast.success("Template deleted")
		return true
	}

	/**
	 * Search templates
	 */
	const searchTemplates = (query: string): TaskTemplate[] => {
		const lower = query.toLowerCase()
		return templates.value.filter(t =>
			t.name.toLowerCase().includes(lower) ||
			t.description.toLowerCase().includes(lower) ||
			t.template.title.toLowerCase().includes(lower)
		)
	}

	return {
		templates: readonly(templates),
		selectedTemplate,
		fetchTemplates,
		createFromTask,
		applyTemplate,
		deleteTemplate,
		searchTemplates,
	}
}
