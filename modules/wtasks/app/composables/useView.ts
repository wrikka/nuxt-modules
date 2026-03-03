/** The current view mode for tasks (e.g., 'list', 'kanban', 'calendar', 'timeline', 'table'). */
const currentView = ref<View>("kanban")
/** The criteria for grouping tasks (e.g., 'status', 'assignee', 'priority', 'dueDate'). */
const groupBy = ref<GroupBy>("status")
/** The fields that are currently visible in the task views. */
const visibleFields = ref<Field[]>(["tags", "assignee", "date", "priority"])
/** Available views for the application. */
const availableViews: View[] = ["list", "kanban", "calendar", "timeline", "table"]
/** View labels for display. */
const viewLabels: Record<View, string> = {
	list: "List",
	kanban: "Board",
	calendar: "Calendar",
	timeline: "Timeline",
	table: "Table",
}
/** View icons for display. */
const viewIcons: Record<View, string> = {
	list: "mdi:format-list-bulleted",
	kanban: "mdi:view-column",
	calendar: "mdi:calendar",
	timeline: "mdi:chart-gantt",
	table: "mdi:table",
}

/**
 * Composable for managing view-related state, such as the current view, grouping, and visible fields.
 */
export const useView = () => {
	/** Sets the current view mode. */
	const setView = (view: View) => {
		currentView.value = view
	}

	/** Sets the grouping criteria. */
	const setGroupBy = (field: GroupBy) => {
		groupBy.value = field
	}

	/** Toggles the visibility of a field. */
	const toggleField = (field: Field) => {
		const index = visibleFields.value.indexOf(field)
		if (index === -1) {
			visibleFields.value.push(field)
		} else {
			visibleFields.value.splice(index, 1)
		}
	}

	/** Sets the visible fields. */
	const setVisibleFields = (fields: Field[]) => {
		visibleFields.value = fields
	}

	/** Checks if a field is visible. */
	const isFieldVisible = (field: Field) => {
		return visibleFields.value.includes(field)
	}

	/** Gets the next view in the cycle. */
	const nextView = () => {
		const currentIndex = availableViews.indexOf(currentView.value)
		const nextIndex = (currentIndex + 1) % availableViews.length
		setView(availableViews[nextIndex])
	}

	/** Gets the previous view in the cycle. */
	const previousView = () => {
		const currentIndex = availableViews.indexOf(currentView.value)
		const prevIndex = (currentIndex - 1 + availableViews.length) % availableViews.length
		setView(availableViews[prevIndex])
	}

	/** Checks if a view is available/enabled. */
	const isViewAvailable = (view: View) => {
		return availableViews.includes(view)
	}

	return {
		currentView: readonly(currentView),
		groupBy: readonly(groupBy),
		visibleFields: readonly(visibleFields),
		availableViews: readonly(availableViews),
		viewLabels: readonly(viewLabels),
		viewIcons: readonly(viewIcons),
		setView,
		setGroupBy,
		toggleField,
		setVisibleFields,
		isFieldVisible,
		nextView,
		previousView,
		isViewAvailable,
	}
}
