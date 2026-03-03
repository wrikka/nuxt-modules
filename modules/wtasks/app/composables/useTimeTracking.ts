import type { Task, TimeEntry } from "~/shared/types/task"

/**
 * Composable for managing time tracking functionality
 */
export const useTimeTracking = () => {
	const { $toast } = useNuxtApp()
	const tasks = useState<Task[]>("tasks", () => [])
	const activeTimers = useState<Record<string, TimeEntry>>("active-timers", () => ({}))

	/**
	 * Start tracking time for a task
	 */
	const startTimer = (taskId: string, description?: string, billable = false) => {
		if (activeTimers.value[taskId]) {
			$toast.error("Timer already running for this task")
			return null
		}

		const timeEntry: TimeEntry = {
			id: crypto.randomUUID(),
			taskId,
			userId: "current-user", // TODO: Get from auth
			startTime: new Date().toISOString(),
			duration: 0,
			description,
			billable,
		}

		activeTimers.value[taskId] = timeEntry
		$toast.success("Timer started")

		return timeEntry
	}

	/**
	 * Stop tracking time for a task
	 */
	const stopTimer = async (taskId: string) => {
		const activeTimer = activeTimers.value[taskId]
		if (!activeTimer) {
			$toast.error("No active timer for this task")
			return null
		}

		const endTime = new Date().toISOString()
		const startDate = new Date(activeTimer.startTime)
		const endDate = new Date(endTime)
		const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000 / 60)

		const completedEntry: TimeEntry = {
			...activeTimer,
			endTime,
			duration,
		}

		// Update task with time entry
		const taskIndex = tasks.value.findIndex((t: Task) => t.id === taskId)
		if (taskIndex !== -1) {
			const task = tasks.value[taskIndex]
			if (task) {
				task.timeEntries = [...(task.timeEntries || []), completedEntry]
				task.actualTime = (task.actualTime || 0) + duration
			}
		}

		// Remove from active timers
		delete activeTimers.value[taskId]

		// Sync with server
		const { error } = await useFetch(`/api/tasks/${taskId}/time-entries`, {
			method: "POST",
			body: completedEntry,
		})

		if (error.value) {
			$toast.error("Failed to save time entry")
			return null
		}

		$toast.success(`Timer stopped. Logged ${duration} minutes`)
		return completedEntry
	}

	/**
	 * Get total time tracked for a task
	 */
	const getTotalTime = (taskId: string) => {
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (!task?.timeEntries?.length) return 0

		return task.timeEntries.reduce((total: number, entry: TimeEntry) => total + entry.duration, 0)
	}

	/**
	 * Get active timer duration in seconds
	 */
	const getActiveTimerDuration = (taskId: string) => {
		const activeTimer = activeTimers.value[taskId]
		if (!activeTimer) return 0

		const startDate = new Date(activeTimer.startTime)
		const now = new Date()
		return Math.floor((now.getTime() - startDate.getTime()) / 1000)
	}

	/**
	 * Check if a task has an active timer
	 */
	const hasActiveTimer = (taskId: string) => {
		return !!activeTimers.value[taskId]
	}

	/**
	 * Manually add time entry
	 */
	const addTimeEntry = async (taskId: string, entry: Omit<TimeEntry, "id" | "taskId">) => {
		const newEntry: TimeEntry = {
			...entry,
			id: crypto.randomUUID(),
			taskId,
		}

		const { error } = await useFetch(`/api/tasks/${taskId}/time-entries`, {
			method: "POST",
			body: newEntry,
		})

		if (error.value) {
			$toast.error("Failed to add time entry")
			return null
		}

		// Update local state
		const taskIndex = tasks.value.findIndex((t: Task) => t.id === taskId)
		if (taskIndex !== -1) {
			const task = tasks.value[taskIndex]
			if (task) {
				task.timeEntries = [...(task.timeEntries || []), newEntry]
				task.actualTime = (task.actualTime || 0) + newEntry.duration
			}
		}

		$toast.success("Time entry added")
		return newEntry
	}

	/**
	 * Delete time entry
	 */
	const deleteTimeEntry = async (taskId: string, entryId: string) => {
		const { error } = await useFetch(`/api/tasks/${taskId}/time-entries/${entryId}`, {
			method: "DELETE",
		})

		if (error.value) {
			$toast.error("Failed to delete time entry")
			return false
		}

		// Update local state
		const taskIndex = tasks.value.findIndex((t: Task) => t.id === taskId)
		if (taskIndex !== -1) {
			const task = tasks.value[taskIndex]
			if (task?.timeEntries) {
				const entry = task.timeEntries.find((e: TimeEntry) => e.id === entryId)
				task.timeEntries = task.timeEntries.filter((e: TimeEntry) => e.id !== entryId)
				if (entry) {
					task.actualTime = (task.actualTime || 0) - entry.duration
				}
			}
		}

		$toast.success("Time entry deleted")
		return true
	}

	/**
	 * Get time entries for a specific date range
	 */
	const getTimeEntriesByDateRange = (taskId: string, startDate: string, endDate: string) => {
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (!task?.timeEntries) return []

		const start = new Date(startDate).getTime()
		const end = new Date(endDate).getTime()

		return task.timeEntries.filter((entry: TimeEntry) => {
			const entryStart = new Date(entry.startTime).getTime()
			return entryStart >= start && entryStart <= end
		})
	}

	/**
	 * Format duration in minutes to readable string
	 */
	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60

		if (hours === 0) return `${mins}m`
		if (mins === 0) return `${hours}h`
		return `${hours}h ${mins}m`
	}

	return {
		activeTimers: readonly(activeTimers),
		startTimer,
		stopTimer,
		getTotalTime,
		getActiveTimerDuration,
		hasActiveTimer,
		addTimeEntry,
		deleteTimeEntry,
		getTimeEntriesByDateRange,
		formatDuration,
	}
}
