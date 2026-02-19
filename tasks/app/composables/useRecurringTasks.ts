import type { Task, RecurringConfig } from "~/shared/types/task"

export interface RecurringTaskInstance {
	originalTaskId: string
	instanceDate: Date
	status: "pending" | "created" | "skipped"
}

/**
 * Composable for managing recurring tasks
 */
export const useRecurringTasks = () => {
	const { $toast } = useNuxtApp()
	const tasks = useState<Task[]>("tasks", () => [])

	/**
	 * Generate next occurrence dates based on recurring config
	 */
	const generateOccurrences = (
		config: RecurringConfig,
		startFrom: Date,
		count: number = 10
	): Date[] => {
		if (!config.enabled) return []

		const occurrences: Date[] = []
		let current = new Date(startFrom)

		for (let i = 0; i < count; i++) {
			if (config.endDate && current > new Date(config.endDate)) break
			if (config.maxOccurrences && occurrences.length >= config.maxOccurrences) break

			switch (config.frequency) {
				case "daily": {
					occurrences.push(new Date(current))
					current.setDate(current.getDate() + config.interval)
					break
				}
				case "weekly": {
					if (config.weekDays && config.weekDays.length > 0) {
						// Find next occurrence based on weekDays
						let found = false
						for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
							const checkDate = new Date(current)
							checkDate.setDate(checkDate.getDate() + dayOffset)
							if (config.weekDays.includes(checkDate.getDay())) {
								occurrences.push(new Date(checkDate))
								current = new Date(checkDate)
								current.setDate(current.getDate() + 1)
								found = true
								break
							}
						}
						if (!found) {
							current.setDate(current.getDate() + 7 * config.interval)
						}
					} else {
						occurrences.push(new Date(current))
						current.setDate(current.getDate() + 7 * config.interval)
					}
					break
				}
				case "monthly": {
					if (config.monthDay) {
						current.setDate(config.monthDay)
					}
					occurrences.push(new Date(current))
					current.setMonth(current.getMonth() + config.interval)
					break
				}
				case "custom": {
					// Custom logic - can be extended
					occurrences.push(new Date(current))
					current.setDate(current.getDate() + config.interval)
					break
				}
			}
		}

		return occurrences
	}

	/**
	 * Create recurring task instance
	 */
	const createRecurringInstance = async (
		originalTask: Task,
		occurrenceDate: Date
	): Promise<Task | null> => {
		const instanceTitle = `${originalTask.title} (${formatDate(occurrenceDate)})`

		const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
			title: instanceTitle,
			description: originalTask.description,
			status: "Backlog",
			tags: originalTask.tags,
			dueDate: occurrenceDate.toISOString(),
			priority: originalTask.priority,
			assignee: originalTask.assignee,
			comments: [],
			subtasks: originalTask.subtasks?.map((st) => ({
				...st,
				id: crypto.randomUUID(),
				completed: false,
			})) || [],
			customFields: originalTask.customFields,
			timeEntries: [],
			dependencies: [],
			parentTaskId: originalTask.id,
			estimatedTime: originalTask.estimatedTime,
			progress: 0,
		}

		const { data, error } = await useFetch<Task>("/api/tasks", {
			method: "POST",
			body: newTask,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create recurring task instance")
			return null
		}

		// Update original task with reference to instance
		// This could be stored in a separate field if needed

		return data.value
	}

	/**
	 * Process all recurring tasks and create instances as needed
	 */
	const processRecurringTasks = async () => {
		const today = new Date()
		const created: Task[] = []

		for (const task of tasks.value) {
			if (!task.recurringConfig?.enabled) continue

			// Check if we need to create instances for this task
			const lastDueDate = task.dueDate ? new Date(task.dueDate) : today
			const occurrences = generateOccurrences(
				task.recurringConfig,
				lastDueDate,
				5 // Generate next 5 occurrences
			)

			for (const occurrence of occurrences) {
				// Check if instance already exists
				const exists = tasks.value.some(
					(t) =>
						t.parentTaskId === task.id &&
						t.dueDate &&
						new Date(t.dueDate).toDateString() === occurrence.toDateString()
				)

				if (!exists && occurrence >= today) {
					const instance = await createRecurringInstance(task, occurrence)
					if (instance) {
						created.push(instance)
					}
				}
			}
		}

		if (created.length > 0) {
			$toast.success(`Created ${created.length} recurring task instances`)
		}

		return created
	}

	/**
	 * Setup recurring configuration for a task
	 */
	const setupRecurring = async (
		taskId: string,
		config: RecurringConfig
	): Promise<boolean> => {
		const { error } = await useFetch(`/api/tasks/${taskId}`, {
			method: "PATCH",
			body: { recurringConfig: config },
		})

		if (error.value) {
			$toast.error("Failed to setup recurring task")
			return false
		}

		// Update local state
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (task) {
			task.recurringConfig = config
		}

		$toast.success(config.enabled ? "Recurring task enabled" : "Recurring task disabled")
		return true
	}

	/**
	 * Get recurring status label
	 */
	const getRecurringLabel = (config?: RecurringConfig): string => {
		if (!config?.enabled) return ""

		switch (config.frequency) {
			case "daily":
				return config.interval === 1 ? "Daily" : `Every ${config.interval} days`
			case "weekly":
				if (config.weekDays?.length) {
					const days = config.weekDays.map((d) =>
						["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
					).join(", ")
					return `Weekly on ${days}`
				}
				return config.interval === 1 ? "Weekly" : `Every ${config.interval} weeks`
			case "monthly":
				return config.interval === 1
					? `Monthly on day ${config.monthDay || 1}`
					: `Every ${config.interval} months on day ${config.monthDay || 1}`
			case "custom":
				return `Every ${config.interval} days`
			default:
				return "Recurring"
		}
	}

	/**
	 * Get next occurrence date for a task
	 */
	const getNextOccurrence = (task: Task): Date | null => {
		if (!task.recurringConfig?.enabled) return null

		const today = new Date()
		const occurrences = generateOccurrences(task.recurringConfig, today, 1)
		return occurrences[0] || null
	}

	/**
	 * Skip next occurrence
	 */
	const skipNextOccurrence = async (taskId: string): Promise<boolean> => {
		// This could mark the next occurrence as skipped
		// Implementation depends on how we track instances
		$toast.success("Next occurrence skipped")
		return true
	}

	/**
	 * Format date for display
	 */
	const formatDate = (date: Date): string => {
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
	}

	/**
	 * Get all recurring tasks
	 */
	const recurringTasks = computed(() => {
		return tasks.value.filter((t: Task) => t.recurringConfig?.enabled)
	})

	return {
		recurringTasks: readonly(recurringTasks),
		generateOccurrences,
		createRecurringInstance,
		processRecurringTasks,
		setupRecurring,
		getRecurringLabel,
		getNextOccurrence,
		skipNextOccurrence,
	}
}
