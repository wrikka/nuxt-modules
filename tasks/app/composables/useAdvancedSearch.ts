import type { Task, SearchFilter, SearchOperator, SavedSearch } from "~/shared/types/task"

export interface SearchSuggestion {
	field: string
	value: string
	type: "field" | "value" | "operator"
}

/**
 * Composable for managing advanced search functionality
 */
export const useAdvancedSearch = () => {
	const tasks = useState<Task[]>("tasks", () => [])
	const searchQuery = ref("")
	const activeFilters = ref<SearchFilter[]>([])
	const savedSearches = useState<SavedSearch[]>("saved-searches", () => [])
	const showAdvancedSearch = ref(false)

	/**
	 * Available search fields
	 */
	const availableFields = [
		{ key: "title", label: "Title", type: "text" },
		{ key: "description", label: "Description", type: "text" },
		{ key: "status", label: "Status", type: "select", options: ["Backlog", "In Design", "In Progress", "In Review", "Done", "Cancelled"] },
		{ key: "priority", label: "Priority", type: "select", options: ["Urgent", "High", "Medium", "Low", "None"] },
		{ key: "assignee", label: "Assignee", type: "text" },
		{ key: "tags", label: "Tags", type: "text" },
		{ key: "dueDate", label: "Due Date", type: "date" },
		{ key: "createdAt", label: "Created Date", type: "date" },
		{ key: "updatedAt", label: "Updated Date", type: "date" },
		{ key: "progress", label: "Progress", type: "number" },
		{ key: "hasSubtasks", label: "Has Subtasks", type: "boolean" },
		{ key: "hasComments", label: "Has Comments", type: "boolean" },
		{ key: "isOverdue", label: "Is Overdue", type: "boolean" },
	]

	/**
	 * Available operators by field type
	 */
	const operatorsByType: Record<string, SearchOperator[]> = {
		text: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith", "isEmpty", "isNotEmpty"],
		select: ["equals", "notEquals", "in", "notIn", "isEmpty", "isNotEmpty"],
		date: ["equals", "notEquals", "greaterThan", "lessThan", "between", "isEmpty", "isNotEmpty"],
		number: ["equals", "notEquals", "greaterThan", "lessThan", "between", "isEmpty", "isNotEmpty"],
		boolean: ["equals"],
	}

	/**
	 * Get operators for a field
	 */
	const getOperatorsForField = (fieldKey: string): SearchOperator[] => {
		const field = availableFields.find((f) => f.key === fieldKey)
		if (!field) return []
		return operatorsByType[field.type] || []
	}

	/**
	 * Add a filter
	 */
	const addFilter = (filter: SearchFilter) => {
		activeFilters.value.push(filter)
	}

	/**
	 * Remove a filter by index
	 */
	const removeFilter = (index: number) => {
		activeFilters.value.splice(index, 1)
	}

	/**
	 * Clear all filters
	 */
	const clearFilters = () => {
		activeFilters.value = []
		searchQuery.value = ""
	}

	/**
	 * Evaluate if a task matches a single filter
	 */
	const matchesFilter = (task: Task, filter: SearchFilter): boolean => {
		const { field, operator, value } = filter

		// Get field value from task
		let taskValue: unknown
		switch (field) {
			case "title":
				taskValue = task.title
				break
			case "description":
				taskValue = task.description
				break
			case "status":
				taskValue = task.status
				break
			case "priority":
				taskValue = task.priority
				break
			case "assignee":
				taskValue = task.assignee?.name
				break
			case "tags":
				taskValue = task.tags?.map((t) => t.name).join(", ")
				break
			case "dueDate":
				taskValue = task.dueDate
				break
			case "createdAt":
				taskValue = task.createdAt
				break
			case "updatedAt":
				taskValue = task.updatedAt
				break
			case "progress":
				taskValue = task.progress
				break
			case "hasSubtasks":
				taskValue = (task.subtasks?.length || 0) > 0
				break
			case "hasComments":
				taskValue = (task.comments?.length || 0) > 0
				break
			case "isOverdue": {
				if (!task.dueDate || task.status === "Done" || task.status === "Cancelled") {
					taskValue = false
				} else {
					taskValue = new Date(task.dueDate) < new Date()
				}
				break
			}
			default:
				// Check custom fields
				if (task.customFields) {
					const customField = task.customFields.find((cf) => cf.fieldId === field)
					taskValue = customField?.value
				}
		}

		// Handle empty checks
		if (operator === "isEmpty") {
			return taskValue === undefined || taskValue === null || taskValue === "" || (Array.isArray(taskValue) && taskValue.length === 0)
		}
		if (operator === "isNotEmpty") {
			return taskValue !== undefined && taskValue !== null && taskValue !== "" && (!Array.isArray(taskValue) || taskValue.length > 0)
		}

		// If value is not provided for other operators, return false
		if (value === undefined || value === null) return false

		// Compare values
		switch (operator) {
			case "equals":
				return taskValue === value
			case "notEquals":
				return taskValue !== value
			case "contains":
				return typeof taskValue === "string" && typeof value === "string" && taskValue.toLowerCase().includes(value.toLowerCase())
			case "notContains":
				return typeof taskValue === "string" && typeof value === "string" && !taskValue.toLowerCase().includes(value.toLowerCase())
			case "startsWith":
				return typeof taskValue === "string" && typeof value === "string" && taskValue.toLowerCase().startsWith(value.toLowerCase())
			case "endsWith":
				return typeof taskValue === "string" && typeof value === "string" && taskValue.toLowerCase().endsWith(value.toLowerCase())
			case "greaterThan": {
				const taskDate = taskValue instanceof Date ? taskValue.getTime() : new Date(taskValue as string).getTime()
				const filterDate = value instanceof Date ? value.getTime() : new Date(value as string).getTime()
				return taskDate > filterDate
			}
			case "lessThan": {
				const taskDate = taskValue instanceof Date ? taskValue.getTime() : new Date(taskValue as string).getTime()
				const filterDate = value instanceof Date ? value.getTime() : new Date(value as string).getTime()
				return taskDate < filterDate
			}
			case "between": {
				if (!Array.isArray(value) || value.length !== 2) return false
				const taskTime = taskValue instanceof Date ? taskValue.getTime() : new Date(taskValue as string).getTime()
				const start = new Date(value[0]).getTime()
				const end = new Date(value[1]).getTime()
				return taskTime >= start && taskTime <= end
			}
			case "in":
				return Array.isArray(value) && value.includes(taskValue as string)
			case "notIn":
				return Array.isArray(value) && !value.includes(taskValue as string)
			default:
				return false
		}
	}

	/**
	 * Filtered tasks based on active filters
	 */
	const filteredTasks = computed(() => {
		if (activeFilters.value.length === 0 && !searchQuery.value) {
			return tasks.value
		}

		return tasks.value.filter((task: Task) => {
			// Check search query
			if (searchQuery.value) {
				const query = searchQuery.value.toLowerCase()
				const matchesSearch =
					task.title.toLowerCase().includes(query) ||
					task.description?.toLowerCase().includes(query) ||
					task.tags?.some((t) => t.name.toLowerCase().includes(query)) ||
					task.assignee?.name.toLowerCase().includes(query)
				if (!matchesSearch) return false
			}

			// Check all active filters
			return activeFilters.value.every((filter) => matchesFilter(task, filter))
		})
	})

	/**
	 * Save current search
	 */
	const saveSearch = (name: string) => {
		const savedSearch: SavedSearch = {
			id: crypto.randomUUID(),
			name,
			filters: [...activeFilters.value],
		}
		savedSearches.value.push(savedSearch)
		// TODO: Persist to server/localStorage
	}

	/**
	 * Load saved search
	 */
	const loadSearch = (searchId: string) => {
		const saved = savedSearches.value.find((s) => s.id === searchId)
		if (saved) {
			activeFilters.value = [...saved.filters]
		}
	}

	/**
	 * Delete saved search
	 */
	const deleteSavedSearch = (searchId: string) => {
		const index = savedSearches.value.findIndex((s) => s.id === searchId)
		if (index !== -1) {
			savedSearches.value.splice(index, 1)
		}
	}

	/**
	 * Toggle advanced search panel
	 */
	const toggleAdvancedSearch = () => {
		showAdvancedSearch.value = !showAdvancedSearch.value
	}

	/**
	 * Get search suggestions based on query
	 */
	const getSuggestions = (query: string): SearchSuggestion[] => {
		if (!query) return []

		const suggestions: SearchSuggestion[] = []
		const lowerQuery = query.toLowerCase()

		// Field suggestions
		for (const field of availableFields) {
			if (field.label.toLowerCase().includes(lowerQuery)) {
				suggestions.push({ field: field.key, value: field.label, type: "field" })
			}
		}

		// Value suggestions from existing tasks
		const taskValues = new Set<string>()
		for (const task of tasks.value) {
			if (task.title.toLowerCase().includes(lowerQuery)) {
				taskValues.add(task.title)
			}
			if (task.assignee?.name.toLowerCase().includes(lowerQuery)) {
				taskValues.add(task.assignee.name)
			}
			for (const tag of task.tags || []) {
				if (tag.name.toLowerCase().includes(lowerQuery)) {
					taskValues.add(tag.name)
				}
			}
		}

		for (const value of taskValues) {
			suggestions.push({ field: "any", value, type: "value" })
		}

		return suggestions.slice(0, 10)
	}

	/**
	 * Quick filters
	 */
	const quickFilters = {
		overdue: () => {
			activeFilters.value = [{ field: "isOverdue", operator: "equals", value: true }]
		},
		today: () => {
			const today = new Date().toISOString().split("T")[0]
			activeFilters.value = [{ field: "dueDate", operator: "equals", value: today }]
		},
		thisWeek: () => {
			const today = new Date()
			const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
			const endOfWeek = new Date(today.setDate(today.getDate() + 6))
			activeFilters.value = [
				{
					field: "dueDate",
					operator: "between",
					value: [startOfWeek.toISOString(), endOfWeek.toISOString()],
				},
			]
		},
		noAssignee: () => {
			activeFilters.value = [{ field: "assignee", operator: "isEmpty" }]
		},
		highPriority: () => {
			activeFilters.value = [{ field: "priority", operator: "in", value: ["Urgent", "High"] }]
		},
	}

	return {
		searchQuery: readonly(searchQuery),
		activeFilters: readonly(activeFilters),
		savedSearches: readonly(savedSearches),
		showAdvancedSearch: readonly(showAdvancedSearch),
		availableFields: readonly(availableFields),
		filteredTasks: readonly(filteredTasks),
		getOperatorsForField,
		addFilter,
		removeFilter,
		clearFilters,
		saveSearch,
		loadSearch,
		deleteSavedSearch,
		toggleAdvancedSearch,
		getSuggestions,
		quickFilters,
	}
}
