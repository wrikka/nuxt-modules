import { onMounted, readonly, ref } from "vue"

export interface WidgetConfig {
	id: string
	type: "tasks" | "calendar" | "stats" | "quick_add"
	title: string
	settings: Record<string, unknown>
}

export function useMobileWidgets() {
	const widgets = ref<WidgetConfig[]>([])
	const isConfigured = ref(false)

	const defaultWidgets: WidgetConfig[] = [
		{
			id: "widget-today",
			type: "tasks",
			title: "Today's Tasks",
			settings: { filter: "today", limit: 5 },
		},
		{
			id: "widget-quick-add",
			type: "quick_add",
			title: "Quick Add",
			settings: {},
		},
		{
			id: "widget-stats",
			type: "stats",
			title: "This Week",
			settings: { period: "week" },
		},
	]

	function addWidget(type: WidgetConfig["type"]): void {
		const id = `widget-${Date.now()}`
		const widget: WidgetConfig = {
			id,
			type,
			title: getDefaultTitle(type),
			settings: getDefaultSettings(type),
		}
		widgets.value.push(widget)
		saveWidgets()
	}

	function removeWidget(id: string): void {
		widgets.value = widgets.value.filter(w => w.id !== id)
		saveWidgets()
	}

	function updateWidget(id: string, updates: Partial<WidgetConfig>): void {
		const widget = widgets.value.find(w => w.id === id)
		if (widget) {
			Object.assign(widget, updates)
			saveWidgets()
		}
	}

	function getDefaultTitle(type: WidgetConfig["type"]): string {
		const titles: Record<string, string> = {
			tasks: "My Tasks",
			calendar: "Calendar",
			stats: "Statistics",
			quick_add: "Quick Add",
		}
		return titles[type] || "Widget"
	}

	function getDefaultSettings(type: WidgetConfig["type"]): Record<string, unknown> {
		const settings: Record<string, Record<string, unknown>> = {
			tasks: { filter: "all", limit: 5 },
			calendar: { view: "week" },
			stats: { period: "week" },
			quick_add: {},
		}
		return settings[type] || {}
	}

	function saveWidgets(): void {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("tasks-mobile-widgets", JSON.stringify(widgets.value))
		}
	}

	function loadWidgets(): void {
		if (typeof localStorage !== "undefined") {
			const stored = localStorage.getItem("tasks-mobile-widgets")
			if (stored) {
				widgets.value = JSON.parse(stored)
			}
			else {
				widgets.value = [...defaultWidgets]
			}
			isConfigured.value = true
		}
	}

	function resetToDefaults(): void {
		widgets.value = [...defaultWidgets]
		saveWidgets()
	}

	// iOS WidgetKit bridge
	function syncToiOS(): void {
		if (typeof window !== "undefined" && "webkit" in window) {
			// @ts-expect-error iOS bridge
			window.webkit?.messageHandlers?.widget?.postMessage?.({
				widgets: widgets.value,
			})
		}
	}

	// Android Widget bridge
	function syncToAndroid(): void {
		if (typeof window !== "undefined" && "Android" in window) {
			// @ts-expect-error Android bridge
			window.Android?.updateWidgets?.(JSON.stringify(widgets.value))
		}
	}

	onMounted(() => {
		loadWidgets()
	})

	return {
		widgets: readonly(widgets),
		isConfigured: readonly(isConfigured),
		addWidget,
		removeWidget,
		updateWidget,
		resetToDefaults,
		syncToiOS,
		syncToAndroid,
	}
}
