import type { Task } from "~/shared/types/task"

export interface KeyboardShortcut {
	key: string
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	meta?: boolean
	action: string
	description: string
}

/**
 * Composable for managing keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {
	const { $toast } = useNuxtApp()
	const isHelpOpen = ref(false)
	const currentModal = ref<string | null>(null)

	// Default shortcuts inspired by Linear and VS Code
	const shortcuts: KeyboardShortcut[] = [
		// Navigation
		{ key: "k", ctrl: true, action: "commandPalette", description: "Open command palette" },
		{ key: "p", ctrl: true, action: "quickSearch", description: "Quick search tasks" },
		{ key: "j", action: "nextTask", description: "Next task" },
		{ key: "k", action: "previousTask", description: "Previous task" },
		{ key: "o", action: "openTask", description: "Open selected task" },
		{ key: "Escape", action: "closeModal", description: "Close modal/exit" },

		// Task operations
		{ key: "c", action: "createTask", description: "Create new task" },
		{ key: "e", action: "editTask", description: "Edit selected task" },
		{ key: "d", action: "deleteTask", description: "Delete selected task" },
		{ key: "space", action: "toggleComplete", description: "Toggle task completion" },
		{ key: "t", action: "assignToMe", description: "Assign to me" },
		{ key: "m", action: "addComment", description: "Add comment" },

		// View switching
		{ key: "1", ctrl: true, action: "viewList", description: "Switch to list view" },
		{ key: "2", ctrl: true, action: "viewKanban", description: "Switch to kanban view" },
		{ key: "3", ctrl: true, action: "viewCalendar", description: "Switch to calendar view" },
		{ key: "4", ctrl: true, action: "viewTimeline", description: "Switch to timeline view" },
		{ key: "5", ctrl: true, action: "viewTable", description: "Switch to table view" },
		{ key: "d", ctrl: true, action: "viewDashboard", description: "Open dashboard" },

		// Filtering
		{ key: "f", action: "focusFilter", description: "Focus filter bar" },
		{ key: "a", action: "filterAll", description: "Show all tasks" },
		{ key: "u", action: "filterMyTasks", description: "Show my tasks" },
		{ key: "y", action: "filterOverdue", description: "Show overdue tasks" },
		{ key: "t", ctrl: true, action: "filterToday", description: "Show today's tasks" },

		// Time tracking
		{ key: "s", action: "startTimer", description: "Start timer" },
		{ key: "x", action: "stopTimer", description: "Stop timer" },
		{ key: "l", action: "logTime", description: "Log time manually" },

		// Bulk actions
		{ key: "a", ctrl: true, shift: true, action: "selectAll", description: "Select all" },
		{ key: "a", shift: true, action: "deselectAll", description: "Deselect all" },

		// Help
		{ key: "?", action: "showHelp", description: "Show keyboard shortcuts" },
	]

	const selectedTaskId = ref<string | null>(null)
	const selectedTaskIds = ref<Set<string>>(new Set())

	/**
	 * Check if shortcut matches keyboard event
	 */
	const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
		if (event.key !== shortcut.key) return false
		if (shortcut.ctrl && !event.ctrlKey) return false
		if (shortcut.shift && !event.shiftKey) return false
		if (shortcut.alt && !event.altKey) return false
		if (shortcut.meta && !event.metaKey) return false
		return true
	}

	/**
	 * Format shortcut for display
	 */
	const formatShortcut = (shortcut: KeyboardShortcut): string => {
		const parts: string[] = []
		if (shortcut.ctrl) parts.push("Ctrl")
		if (shortcut.shift) parts.push("Shift")
		if (shortcut.alt) parts.push("Alt")
		if (shortcut.meta) parts.push("⌘")
		parts.push(shortcut.key.toUpperCase())
		return parts.join("+")
	}

	/**
	 * Handle keyboard event
	 */
	const handleKeydown = (event: KeyboardEvent) => {
		// Don't trigger shortcuts when typing in inputs
		if (
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			(event.target as HTMLElement)?.isContentEditable
		) {
			// Allow Escape to close modal even when in input
			if (event.key !== "Escape") return
		}

		for (const shortcut of shortcuts) {
			if (matchesShortcut(event, shortcut)) {
				event.preventDefault()
				executeAction(shortcut.action)
				return
			}
		}
	}

	/**
	 * Execute action by name
	 */
	const executeAction = (action: string) => {
		switch (action) {
			case "showHelp":
				isHelpOpen.value = true
				break
			case "closeModal":
				isHelpOpen.value = false
				currentModal.value = null
				break
			case "commandPalette":
				// TODO: Open command palette
				$toast.info("Command palette (coming soon)")
				break
			case "quickSearch":
				// TODO: Focus quick search
				$toast.info("Quick search (coming soon)")
				break
			case "createTask":
				currentModal.value = "createTask"
				break
			case "editTask":
				if (selectedTaskId.value) {
					currentModal.value = "editTask"
				}
				break
			case "deleteTask":
				if (selectedTaskId.value) {
					// TODO: Show confirmation
					$toast.info("Delete task (coming soon)")
				}
				break
			case "toggleComplete":
				// TODO: Toggle completion
				$toast.info("Toggle complete (coming soon)")
				break
			case "focusFilter":
				// TODO: Focus filter input
				$toast.info("Focus filter (coming soon)")
				break
			case "filterAll":
				// TODO: Clear all filters
				$toast.info("Show all tasks (coming soon)")
				break
			case "filterMyTasks":
				// TODO: Filter by current user
				$toast.info("Show my tasks (coming soon)")
				break
			case "filterOverdue":
				// TODO: Filter overdue
				$toast.info("Show overdue tasks (coming soon)")
				break
			case "filterToday":
				// TODO: Filter today's tasks
				$toast.info("Show today's tasks (coming soon)")
				break
			case "startTimer":
				// TODO: Start timer for selected task
				if (selectedTaskId.value) {
					$toast.info(`Start timer for task ${selectedTaskId.value} (coming soon)`)
				}
				break
			case "stopTimer":
				// TODO: Stop active timer
				$toast.info("Stop timer (coming soon)")
				break
			case "logTime":
				// TODO: Open time log modal
				$toast.info("Log time (coming soon)")
				break
			case "viewList":
				// TODO: Switch to list view
				$toast.info("Switch to list view (coming soon)")
				break
			case "viewKanban":
				// TODO: Switch to kanban view
				$toast.info("Switch to kanban view (coming soon)")
				break
			case "viewCalendar":
				// TODO: Switch to calendar view
				$toast.info("Switch to calendar view (coming soon)")
				break
			case "viewTimeline":
				// TODO: Switch to timeline view
				$toast.info("Switch to timeline view (coming soon)")
				break
			case "viewTable":
				// TODO: Switch to table view
				$toast.info("Switch to table view (coming soon)")
				break
			case "viewDashboard":
				// TODO: Open dashboard
				$toast.info("Open dashboard (coming soon)")
				break
			case "selectAll":
				// TODO: Select all visible tasks
				$toast.info("Select all (coming soon)")
				break
			case "deselectAll":
				selectedTaskIds.value.clear()
				selectedTaskId.value = null
				break
			case "nextTask":
				// TODO: Navigate to next task
				$toast.info("Next task (coming soon)")
				break
			case "previousTask":
				// TODO: Navigate to previous task
				$toast.info("Previous task (coming soon)")
				break
			case "openTask":
				// TODO: Open selected task detail
				if (selectedTaskId.value) {
					currentModal.value = "taskDetail"
				}
				break
			case "assignToMe":
				// TODO: Assign selected task to current user
				$toast.info("Assign to me (coming soon)")
				break
			case "addComment":
				// TODO: Focus comment input
				$toast.info("Add comment (coming soon)")
				break
		}
	}

	/**
	 * Setup global keyboard listener
	 */
	const setupListeners = () => {
		if (import.meta.client) {
			window.addEventListener("keydown", handleKeydown)
		}
	}

	/**
	 * Remove global keyboard listener
	 */
	const removeListeners = () => {
		if (import.meta.client) {
			window.removeEventListener("keydown", handleKeydown)
		}
	}

	/**
	 * Select a task
	 */
	const selectTask = (taskId: string) => {
		selectedTaskId.value = taskId
		selectedTaskIds.value.add(taskId)
	}

	/**
	 * Deselect a task
	 */
	const deselectTask = (taskId: string) => {
		selectedTaskIds.value.delete(taskId)
		if (selectedTaskId.value === taskId) {
			selectedTaskId.value = null
		}
	}

	/**
	 * Toggle task selection
	 */
	const toggleTaskSelection = (taskId: string) => {
		if (selectedTaskIds.value.has(taskId)) {
			deselectTask(taskId)
		} else {
			selectTask(taskId)
		}
	}

	/**
	 * Get shortcuts grouped by category
	 */
	const shortcutsByCategory = computed(() => {
		return {
			navigation: shortcuts.filter((s) =>
				["commandPalette", "quickSearch", "nextTask", "previousTask", "openTask", "closeModal"].includes(s.action)
			),
			tasks: shortcuts.filter((s) =>
				["createTask", "editTask", "deleteTask", "toggleComplete", "assignToMe", "addComment"].includes(s.action)
			),
			views: shortcuts.filter((s) =>
				["viewList", "viewKanban", "viewCalendar", "viewTimeline", "viewTable", "viewDashboard"].includes(s.action)
			),
			filtering: shortcuts.filter((s) =>
				["focusFilter", "filterAll", "filterMyTasks", "filterOverdue", "filterToday"].includes(s.action)
			),
			time: shortcuts.filter((s) => ["startTimer", "stopTimer", "logTime"].includes(s.action)),
			selection: shortcuts.filter((s) => ["selectAll", "deselectAll"].includes(s.action)),
			other: shortcuts.filter((s) => s.action === "showHelp"),
		}
	})

	return {
		shortcuts: readonly(shortcuts),
		shortcutsByCategory: readonly(shortcutsByCategory),
		isHelpOpen: readonly(isHelpOpen),
		currentModal: readonly(currentModal),
		selectedTaskId: readonly(selectedTaskId),
		selectedTaskIds: readonly(selectedTaskIds),
		formatShortcut,
		setupListeners,
		removeListeners,
		executeAction,
		selectTask,
		deselectTask,
		toggleTaskSelection,
	}
}
