import type { CustomField, CustomFieldValue, CustomFieldType, Task } from "~/shared/types/task"

export interface CustomFieldTemplate {
	id: string
	name: string
	fields: CustomField[]
}

/**
 * Composable for managing custom fields
 */
export const useCustomFields = () => {
	const { $toast } = useNuxtApp()
	const tasks = useState<Task[]>("tasks", () => [])
	const customFields = useState<CustomField[]>("custom-fields", () => [])

	/**
	 * Default field templates
	 */
	const fieldTemplates: Record<string, Omit<CustomField, "id">> = {
		effort: {
			name: "Effort",
			type: "select",
			options: ["XS", "S", "M", "L", "XL"],
			required: false,
		},
		impact: {
			name: "Impact",
			type: "select",
			options: ["Low", "Medium", "High", "Critical"],
			required: false,
		},
		storyPoints: {
			name: "Story Points",
			type: "number",
			required: false,
		},
		sprint: {
			name: "Sprint",
			type: "text",
			required: false,
		},
		epic: {
			name: "Epic",
			type: "text",
			required: false,
		},
		component: {
			name: "Component",
			type: "multiSelect",
			options: ["Frontend", "Backend", "API", "Database", "DevOps", "Design"],
			required: false,
		},
		reviewer: {
			name: "Reviewer",
			type: "text",
			required: false,
		},
	}

	/**
	 * Create a new custom field
	 */
	const createField = async (fieldData: Omit<CustomField, "id">): Promise<CustomField | null> => {
		const field: CustomField = {
			...fieldData,
			id: crypto.randomUUID(),
		}

		const { data, error } = await useFetch<CustomField>("/api/custom-fields", {
			method: "POST",
			body: field,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create custom field")
			return null
		}

		customFields.value.push(data.value)
		$toast.success("Custom field created")
		return data.value
	}

	/**
	 * Update custom field
	 */
	const updateField = async (fieldId: string, updates: Partial<CustomField>): Promise<boolean> => {
		const { error } = await useFetch(`/api/custom-fields/${fieldId}`, {
			method: "PATCH",
			body: updates,
		})

		if (error.value) {
			$toast.error("Failed to update custom field")
			return false
		}

		const field = customFields.value.find((f) => f.id === fieldId)
		if (field) {
			Object.assign(field, updates)
		}

		$toast.success("Custom field updated")
		return true
	}

	/**
	 * Delete custom field
	 */
	const deleteField = async (fieldId: string): Promise<boolean> => {
		const { error } = await useFetch(`/api/custom-fields/${fieldId}`, {
			method: "DELETE",
		})

		if (error.value) {
			$toast.error("Failed to delete custom field")
			return false
		}

		const index = customFields.value.findIndex((f) => f.id === fieldId)
		if (index !== -1) {
			customFields.value.splice(index, 1)
		}

		// Remove field values from all tasks
		for (const task of tasks.value) {
			if (task.customFields) {
				task.customFields = task.customFields.filter((cf) => cf.fieldId !== fieldId)
			}
		}

		$toast.success("Custom field deleted")
		return true
	}

	/**
	 * Get field by ID
	 */
	const getField = (fieldId: string): CustomField | undefined => {
		return customFields.value.find((f) => f.id === fieldId)
	}

	/**
	 * Get field value for a task
	 */
	const getFieldValue = (task: Task, fieldId: string): unknown => {
		const fieldValue = task.customFields?.find((cf) => cf.fieldId === fieldId)
		return fieldValue?.value
	}

	/**
	 * Set field value for a task
	 */
	const setFieldValue = async (
		taskId: string,
		fieldId: string,
		value: CustomFieldValue["value"]
	): Promise<boolean> => {
		const customFieldValue: CustomFieldValue = {
			fieldId,
			value,
		}

		const { error } = await useFetch(`/api/tasks/${taskId}/custom-fields`, {
			method: "PATCH",
			body: customFieldValue,
		})

		if (error.value) {
			$toast.error("Failed to update field value")
			return false
		}

		// Update local state
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (task) {
			if (!task.customFields) {
				task.customFields = []
			}
			const existingIndex = task.customFields.findIndex((cf) => cf.fieldId === fieldId)
			if (existingIndex !== -1) {
				task.customFields[existingIndex].value = value
			} else {
				task.customFields.push(customFieldValue)
			}
		}

		return true
	}

	/**
	 * Get field type icon
	 */
	const getFieldTypeIcon = (type: CustomFieldType): string => {
		switch (type) {
			case "text":
				return "mdi:format-text"
			case "number":
				return "mdi:numeric"
			case "date":
				return "mdi:calendar"
			case "select":
				return "mdi:arrow-down-drop-circle"
			case "multiSelect":
				return "mdi:check-all"
			case "checkbox":
				return "mdi:checkbox-marked"
			case "url":
				return "mdi:link"
			case "email":
				return "mdi:email"
			default:
				return "mdi:text-box"
		}
	}

	/**
	 * Get field type label
	 */
	const getFieldTypeLabel = (type: CustomFieldType): string => {
		switch (type) {
			case "text":
				return "Text"
			case "number":
				return "Number"
			case "date":
				return "Date"
			case "select":
				return "Single Select"
			case "multiSelect":
				return "Multi Select"
			case "checkbox":
				return "Checkbox"
			case "url":
				return "URL"
			case "email":
				return "Email"
			default:
				return type
		}
	}

	/**
	 * Validate field value
	 */
	const validateFieldValue = (field: CustomField, value: unknown): string | null => {
		if (field.required && (value === undefined || value === null || value === "")) {
			return `${field.name} is required`
		}

		switch (field.type) {
			case "email":
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
					return "Invalid email address"
				}
				break
			case "url":
				try {
					if (value) new URL(value as string)
				} catch {
					return "Invalid URL"
				}
				break
			case "number":
				if (value !== undefined && value !== null && isNaN(Number(value))) {
					return "Invalid number"
				}
				break
		}

		return null
	}

	/**
	 * Create field from template
	 */
	const createFromTemplate = (templateKey: string): Promise<CustomField | null> => {
		const template = fieldTemplates[templateKey]
		if (!template) {
			$toast.error("Template not found")
			return Promise.resolve(null)
		}

		return createField(template)
	}

	/**
	 * Get tasks by custom field value
	 */
	const getTasksByFieldValue = (fieldId: string, value: unknown): Task[] => {
		return tasks.value.filter((task: Task) => {
			const fieldValue = task.customFields?.find((cf) => cf.fieldId === fieldId)
			return fieldValue?.value === value
		})
	}

	return {
		customFields: readonly(customFields),
		fieldTemplates: readonly(fieldTemplates),
		createField,
		updateField,
		deleteField,
		getField,
		getFieldValue,
		setFieldValue,
		getFieldTypeIcon,
		getFieldTypeLabel,
		validateFieldValue,
		createFromTemplate,
		getTasksByFieldValue,
	}
}
