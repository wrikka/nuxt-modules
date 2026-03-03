/**
 * Composable for Custom Dashboard Widgets
 */
export const useDashboardWidgets = () => {
	const { $toast } = useNuxtApp()

	const widgets = useState<{
		id: string
		type: "stats" | "chart" | "tasks" | "calendar" | "recent" | "custom"
		title: string
		position: { x: number; y: number; w: number; h: number }
		config: Record<string, unknown>
	}[]>("dashboard-widgets", () => [])

	const isEditing = useState<boolean>("dashboard-editing", () => false)
	const availableWidgets = [
		{ type: "stats", title: "Task Statistics", icon: "mdi:chart-bar" },
		{ type: "chart", title: "Status Chart", icon: "mdi:chart-pie" },
		{ type: "tasks", title: "My Tasks", icon: "mdi:format-list-checks" },
		{ type: "calendar", title: "Calendar", icon: "mdi:calendar" },
		{ type: "recent", title: "Recent Activity", icon: "mdi:history" },
		{ type: "custom", title: "Custom Widget", icon: "mdi:widgets" },
	]

	/**
	 * Add widget
	 */
	const addWidget = (type: typeof availableWidgets[0]["type"], title: string) => {
		const widget = {
			id: crypto.randomUUID(),
			type,
			title,
			position: { x: 0, y: 0, w: 2, h: 2 },
			config: {},
		}
		widgets.value.push(widget)
		return widget
	}

	/**
	 * Remove widget
	 */
	const removeWidget = (widgetId: string) => {
		widgets.value = widgets.value.filter(w => w.id !== widgetId)
	}

	/**
	 * Update widget position
	 */
	const updatePosition = (widgetId: string, position: { x: number; y: number; w: number; h: number }) => {
		const widget = widgets.value.find(w => w.id === widgetId)
		if (widget) widget.position = position
	}

	/**
	 * Update widget config
	 */
	const updateConfig = (widgetId: string, config: Record<string, unknown>) => {
		const widget = widgets.value.find(w => w.id === widgetId)
		if (widget) widget.config = { ...widget.config, ...config }
	}

	/**
	 * Save dashboard layout
	 */
	const saveLayout = async () => {
		const { error } = await useFetch("/api/dashboard/layout", {
			method: "POST",
			body: { widgets: widgets.value },
		})

		if (error.value) {
			$toast.error("Failed to save layout")
			return false
		}

		$toast.success("Dashboard saved")
		return true
	}

	/**
	 * Load dashboard layout
	 */
	const loadLayout = async () => {
		const { data } = await useFetch<{ widgets: typeof widgets.value }>("/api/dashboard/layout")
		if (data.value?.widgets) {
			widgets.value = data.value.widgets
		}
	}

	/**
	 * Toggle edit mode
	 */
	const toggleEditMode = () => {
		isEditing.value = !isEditing.value
	}

	/**
	 * Reset to default
	 */
	const resetToDefault = () => {
		widgets.value = [
			{ id: crypto.randomUUID(), type: "stats", title: "Overview", position: { x: 0, y: 0, w: 4, h: 2 }, config: {} },
			{ id: crypto.randomUUID(), type: "tasks", title: "My Tasks", position: { x: 0, y: 2, w: 2, h: 4 }, config: {} },
			{ id: crypto.randomUUID(), type: "chart", title: "Status", position: { x: 2, y: 2, w: 2, h: 2 }, config: {} },
		]
	}

	return {
		widgets: readonly(widgets),
		isEditing,
		availableWidgets,
		addWidget,
		removeWidget,
		updatePosition,
		updateConfig,
		saveLayout,
		loadLayout,
		toggleEditMode,
		resetToDefault,
	}
}
