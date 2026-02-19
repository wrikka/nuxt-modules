import type { Task, TaskDependency } from "~/shared/types/task"

export interface TimelineTask extends Task {
	startPosition: number // percentage from start
	duration: number // in days
	overlappingCount: number
	overlapIndex: number
}

export interface GanttRow {
	task: TimelineTask
	subtasks: TimelineTask[]
}

/**
 * Composable for managing timeline/gantt view functionality
 */
export const useTimeline = () => {
	const tasks = useState<Task[]>("tasks", () => [])
	const zoomLevel = ref(1) // 1 = day, 7 = week, 30 = month

	/**
	 * Calculate date range for all tasks
	 */
	const dateRange = computed(() => {
		const datedTasks = tasks.value.filter((t: Task) => t.startDate || t.dueDate)
		if (datedTasks.length === 0) {
			const today = new Date()
			return {
				start: new Date(today.getFullYear(), today.getMonth(), 1),
				end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
			}
		}

		const dates = datedTasks.flatMap((t: Task) => [
			t.startDate ? new Date(t.startDate) : null,
			t.dueDate ? new Date(t.dueDate) : null,
		]).filter(Boolean) as Date[]

		const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
		const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

		// Add padding
		minDate.setDate(minDate.getDate() - 7)
		maxDate.setDate(maxDate.getDate() + 7)

		return { start: minDate, end: maxDate }
	})

	/**
	 * Calculate total days in timeline
	 */
	const totalDays = computed(() => {
		const diff = dateRange.value.end.getTime() - dateRange.value.start.getTime()
		return Math.ceil(diff / (1000 * 60 * 60 * 24))
	})

	/**
	 * Generate timeline headers (days/weeks/months)
	 */
	const timelineHeaders = computed(() => {
		const headers: { date: Date; label: string; isWeekend: boolean }[] = []
		const current = new Date(dateRange.value.start)

		for (let i = 0; i < totalDays.value; i++) {
			headers.push({
				date: new Date(current),
				label: current.getDate().toString(),
				isWeekend: current.getDay() === 0 || current.getDay() === 6,
			})
			current.setDate(current.getDate() + 1)
		}

		return headers
	})

	/**
	 * Calculate task position and duration for timeline
	 */
	const calculateTaskPosition = (task: Task): TimelineTask | null => {
		if (!task.startDate && !task.dueDate) return null

		const rangeStart = dateRange.value.start.getTime()
		const rangeEnd = dateRange.value.end.getTime()
		const totalRange = rangeEnd - rangeStart

		let taskStart: Date
		let taskEnd: Date

		if (task.startDate && task.dueDate) {
			taskStart = new Date(task.startDate)
			taskEnd = new Date(task.dueDate)
		} else if (task.startDate) {
			taskStart = new Date(task.startDate)
			taskEnd = new Date(taskStart.getTime() + 24 * 60 * 60 * 1000) // 1 day default
		} else if (task.dueDate) {
			taskEnd = new Date(task.dueDate)
			taskStart = new Date(taskEnd.getTime() - 24 * 60 * 60 * 1000) // 1 day default
		} else {
			return null
		}

		const startOffset = Math.max(0, taskStart.getTime() - rangeStart)
		const duration = taskEnd.getTime() - taskStart.getTime()

		const startPosition = (startOffset / totalRange) * 100
		const durationPercent = (duration / totalRange) * 100

		return {
			...task,
			startPosition,
			duration: Math.max(1, Math.ceil(duration / (1000 * 60 * 60 * 24))), // minimum 1 day
			overlappingCount: 1,
			overlapIndex: 0,
		}
	}

	/**
	 * Get tasks with timeline positions
	 */
	const timelineTasks = computed(() => {
		const positioned: TimelineTask[] = []

		for (const task of tasks.value) {
			const positionedTask = calculateTaskPosition(task)
			if (positionedTask) {
				positioned.push(positionedTask)
			}
		}

		// Calculate overlapping
		for (let i = 0; i < positioned.length; i++) {
			let overlapCount = 1
			let overlapIndex = 0

			for (let j = 0; j < positioned.length; j++) {
				if (i === j) continue

				const taskA = positioned[i]
				const taskB = positioned[j]

				// Check if tasks overlap
				const aStart = taskA.startPosition
				const aEnd = taskA.startPosition + (taskA.duration / totalDays.value) * 100
				const bStart = taskB.startPosition
				const bEnd = taskB.startPosition + (taskB.duration / totalDays.value) * 100

				if (aStart < bEnd && aEnd > bStart) {
					overlapCount++
					if (j < i) overlapIndex++
				}
			}

			positioned[i].overlappingCount = overlapCount
			positioned[i].overlapIndex = overlapIndex
		}

		return positioned.sort((a, b) => a.startPosition - b.startPosition)
	})

	/**
	 * Group tasks by status for gantt view
	 */
	const ganttRowsByStatus = computed(() => {
		const rows: Record<string, GanttRow[]> = {}
		const statusOrder = ["Backlog", "In Design", "In Progress", "In Review", "Done", "Cancelled"]

		for (const status of statusOrder) {
			rows[status] = timelineTasks.value
				.filter((t) => t.status === status)
				.map((task) => ({
					task,
					subtasks: task.subtasks?.map((st) => {
						const subtask = tasks.value.find((t: Task) => t.id === st.id)
						return subtask ? calculateTaskPosition(subtask) : null
					}).filter(Boolean) as TimelineTask[] || [],
				}))
		}

		return rows
	})

	/**
	 * Check if a task is overdue
	 */
	const isOverdue = (task: Task) => {
		if (task.status === "Done" || task.status === "Cancelled") return false
		if (!task.dueDate) return false
		return new Date(task.dueDate) < new Date()
	}

	/**
	 * Get task dependencies
	 */
	const getTaskDependencies = (taskId: string): TaskDependency[] => {
		const task = tasks.value.find((t: Task) => t.id === taskId)
		return task?.dependencies || []
	}

	/**
	 * Check if task is blocked by dependencies
	 */
	const isBlocked = (taskId: string) => {
		const deps = getTaskDependencies(taskId)
		return deps.some((dep) => {
			if (dep.type === "blockedBy") {
				const sourceTask = tasks.value.find((t: Task) => t.id === dep.sourceTaskId)
				return sourceTask?.status !== "Done"
			}
			return false
		})
	}

	/**
	 * Zoom functions
	 */
	const zoomIn = () => {
		zoomLevel.value = Math.max(0.5, zoomLevel.value * 0.8)
	}

	const zoomOut = () => {
		zoomLevel.value = Math.min(3, zoomLevel.value * 1.2)
	}

	const resetZoom = () => {
		zoomLevel.value = 1
	}

	/**
	 * Format date for display
	 */
	const formatDate = (date: Date | string) => {
		const d = typeof date === "string" ? new Date(date) : date
		return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
	}

	/**
	 * Get duration label
	 */
	const getDurationLabel = (days: number) => {
		if (days === 1) return "1 day"
		if (days < 7) return `${days} days`
		if (days === 7) return "1 week"
		if (days < 30) return `${Math.floor(days / 7)} weeks`
		if (days === 30) return "1 month"
		return `${Math.floor(days / 30)} months`
	}

	return {
		zoomLevel: readonly(zoomLevel),
		dateRange: readonly(dateRange),
		totalDays: readonly(totalDays),
		timelineHeaders: readonly(timelineHeaders),
		timelineTasks: readonly(timelineTasks),
		ganttRowsByStatus: readonly(ganttRowsByStatus),
		previousMonth,
		nextMonth,
		isOverdue,
		getTaskDependencies,
		isBlocked,
		zoomIn,
		zoomOut,
		resetZoom,
		formatDate,
		getDurationLabel,
	}
}
