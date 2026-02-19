import type { Task } from "~/shared/types/task"

export interface CalendarDay {
	date: Date
	isCurrentMonth: boolean
	isToday: boolean
	tasks: Task[]
}

export interface CalendarWeek {
	days: CalendarDay[]
}

/**
 * Composable for managing calendar view functionality
 */
export const useCalendar = () => {
	const currentDate = ref(new Date())
	const tasks = useState<Task[]>("tasks", () => [])

	const currentMonth = computed(() => currentDate.value.getMonth())
	const currentYear = computed(() => currentDate.value.getFullYear())

	/**
	 * Navigate to previous month
	 */
	const previousMonth = () => {
		currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
	}

	/**
	 * Navigate to next month
	 */
	const nextMonth = () => {
		currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
	}

	/**
	 * Navigate to today
	 */
	const goToToday = () => {
		currentDate.value = new Date()
	}

	/**
	 * Get tasks for a specific date
	 */
	const getTasksForDate = (date: Date) => {
		const dateString = date.toISOString().split("T")[0]
		return tasks.value.filter((task: Task) => {
			if (task.dueDate) {
				return task.dueDate.startsWith(dateString)
			}
			if (task.startDate) {
				return task.startDate.startsWith(dateString)
			}
			return false
		})
	}

	/**
	 * Get tasks within a date range
	 */
	const getTasksInRange = (startDate: Date, endDate: Date) => {
		return tasks.value.filter((task: Task) => {
			if (!task.dueDate && !task.startDate) return false

			const taskStart = task.startDate ? new Date(task.startDate) : null
			const taskEnd = task.dueDate ? new Date(task.dueDate) : null

			if (taskStart && taskEnd) {
				return taskStart <= endDate && taskEnd >= startDate
			}
			if (taskStart) {
				return taskStart >= startDate && taskStart <= endDate
			}
			if (taskEnd) {
				return taskEnd >= startDate && taskEnd <= endDate
			}
			return false
		})
	}

	/**
	 * Generate calendar weeks for current month view
	 */
	const calendarWeeks = computed<CalendarWeek[]>(() => {
		const year = currentYear.value
		const month = currentMonth.value

		const firstDayOfMonth = new Date(year, month, 1)
		const lastDayOfMonth = new Date(year, month + 1, 0)
		const daysInMonth = lastDayOfMonth.getDate()

		const firstDayOfWeek = firstDayOfMonth.getDay()
		const today = new Date()

		const weeks: CalendarWeek[] = []
		let currentWeek: CalendarDay[] = []

		// Add days from previous month
		const daysFromPrevMonth = firstDayOfWeek
		const prevMonth = new Date(year, month, 0)
		for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
			const date = new Date(year, month - 1, prevMonth.getDate() - i)
			currentWeek.push({
				date,
				isCurrentMonth: false,
				isToday: date.toDateString() === today.toDateString(),
				tasks: getTasksForDate(date),
			})
		}

		// Add days from current month
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day)
			currentWeek.push({
				date,
				isCurrentMonth: true,
				isToday: date.toDateString() === today.toDateString(),
				tasks: getTasksForDate(date),
			})

			if (currentWeek.length === 7) {
				weeks.push({ days: currentWeek })
				currentWeek = []
			}
		}

		// Add days from next month
		if (currentWeek.length > 0) {
			const daysNeeded = 7 - currentWeek.length
			for (let day = 1; day <= daysNeeded; day++) {
				const date = new Date(year, month + 1, day)
				currentWeek.push({
					date,
					isCurrentMonth: false,
					isToday: date.toDateString() === today.toDateString(),
					tasks: getTasksForDate(date),
				})
			}
			weeks.push({ days: currentWeek })
		}

		return weeks
	})

	/**
	 * Get all tasks due this month
	 */
	const tasksDueThisMonth = computed(() => {
		const startOfMonth = new Date(currentYear.value, currentMonth.value, 1)
		const endOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
		return getTasksInRange(startOfMonth, endOfMonth)
	})

	/**
	 * Get overdue tasks
	 */
	const overdueTasks = computed(() => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		return tasks.value.filter((task: Task) => {
			if (task.status === "Done" || task.status === "Cancelled") return false
			if (!task.dueDate) return false
			return new Date(task.dueDate) < today
		})
	})

	/**
	 * Format date for display
	 */
	const formatDate = (date: Date, format: "short" | "long" | "full" = "short") => {
		if (format === "short") {
			return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
		}
		if (format === "long") {
			return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
		}
		return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
	}

	/**
	 * Get month name
	 */
	const monthName = computed(() => {
		return currentDate.value.toLocaleDateString("en-US", { month: "long", year: "numeric" })
	})

	return {
		currentDate: readonly(currentDate),
		currentMonth: readonly(currentMonth),
		currentYear: readonly(currentYear),
		monthName: readonly(monthName),
		calendarWeeks: readonly(calendarWeeks),
		tasksDueThisMonth: readonly(tasksDueThisMonth),
		overdueTasks: readonly(overdueTasks),
		previousMonth,
		nextMonth,
		goToToday,
		getTasksForDate,
		getTasksInRange,
		formatDate,
	}
}
