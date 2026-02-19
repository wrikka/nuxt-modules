import type { Task, TaskAnalytics } from "~/shared/types/task"

export interface ChartData {
	labels: string[]
	data: number[]
	colors: string[]
}

export interface TimeSeriesData {
	date: string
	value: number
}

/**
 * Composable for managing analytics and dashboard functionality
 */
export const useAnalytics = () => {
	const tasks = useState<Task[]>("tasks", () => [])
	const dateRange = ref({
		start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
		end: new Date(),
	})

	/**
	 * Calculate task analytics
	 */
	const analytics = computed<TaskAnalytics>(() => {
		const allTasks = tasks.value
		const today = new Date()

		const completedTasks = allTasks.filter((t: Task) => t.status === "Done")
		const inProgressTasks = allTasks.filter((t: Task) => t.status === "In Progress" || t.status === "In Review")
		const overdueTasks = allTasks.filter((t: Task) => {
			if (t.status === "Done" || t.status === "Cancelled") return false
			if (!t.dueDate) return false
			return new Date(t.dueDate) < today
		})

		// Tasks by status
		const tasksByStatus: Record<string, number> = {}
		for (const task of allTasks) {
			tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1
		}

		// Tasks by priority
		const tasksByPriority: Record<string, number> = {}
		for (const task of allTasks) {
			tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1
		}

		// Tasks by assignee
		const tasksByAssignee: Record<string, number> = {}
		for (const task of allTasks) {
			const assignee = task.assignee?.name || "Unassigned"
			tasksByAssignee[assignee] = (tasksByAssignee[assignee] || 0) + 1
		}

		// Time tracking
		let timeTrackedTotal = 0
		const timeTrackedByUser: Record<string, number> = {}

		for (const task of allTasks) {
			for (const entry of task.timeEntries || []) {
				timeTrackedTotal += entry.duration
				const userId = entry.userId
				timeTrackedByUser[userId] = (timeTrackedByUser[userId] || 0) + entry.duration
			}
		}

		// Average completion time
		let totalCompletionTime = 0
		let completedCount = 0
		for (const task of completedTasks) {
			if (task.createdAt && task.completedAt) {
				const created = new Date(task.createdAt).getTime()
				const completed = new Date(task.completedAt).getTime()
				const hours = (completed - created) / (1000 * 60 * 60)
				totalCompletionTime += hours
				completedCount++
			}
		}
		const averageCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0

		return {
			totalTasks: allTasks.length,
			completedTasks: completedTasks.length,
			inProgressTasks: inProgressTasks.length,
			overdueTasks: overdueTasks.length,
			averageCompletionTime,
			tasksByStatus,
			tasksByPriority,
			tasksByAssignee,
			timeTrackedTotal,
			timeTrackedByUser,
		}
	})

	/**
	 * Status chart data
	 */
	const statusChartData = computed<ChartData>(() => {
		const statusColors: Record<string, string> = {
			Backlog: "#94a3b8",
			"In Design": "#818cf8",
			"In Progress": "#fbbf24",
			"In Review": "#60a5fa",
			Done: "#34d399",
			Cancelled: "#f87171",
		}

		const data = analytics.value.tasksByStatus
		return {
			labels: Object.keys(data),
			data: Object.values(data),
			colors: Object.keys(data).map((status) => statusColors[status] || "#94a3b8"),
		}
	})

	/**
	 * Priority chart data
	 */
	const priorityChartData = computed<ChartData>(() => {
		const priorityColors: Record<string, string> = {
			Urgent: "#ef4444",
			High: "#f97316",
			Medium: "#eab308",
			Low: "#22c55e",
			None: "#94a3b8",
		}

		const data = analytics.value.tasksByPriority
		return {
			labels: Object.keys(data),
			data: Object.values(data),
			colors: Object.keys(data).map((priority) => priorityColors[priority] || "#94a3b8"),
		}
	})

	/**
	 * Assignee chart data (top 10)
	 */
	const assigneeChartData = computed<ChartData>(() => {
		const data = analytics.value.tasksByAssignee
		const sorted = Object.entries(data)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)

		return {
			labels: sorted.map(([name]) => name),
			data: sorted.map(([, count]) => count),
			colors: sorted.map((_, i) => `hsl(${i * 36}, 70%, 60%)`),
		}
	})

	/**
	 * Completion rate over time
	 */
	const completionTrend = computed<TimeSeriesData[]>(() => {
		const days = 30
		const data: TimeSeriesData[] = []
		const today = new Date()

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split("T")[0]

			const completedThatDay = tasks.value.filter((t: Task) => {
				if (t.status !== "Done" || !t.completedAt) return false
				return t.completedAt.startsWith(dateStr)
			}).length

			data.push({
				date: dateStr,
				value: completedThatDay,
			})
		}

		return data
	})

	/**
	 * Tasks created over time
	 */
	const creationTrend = computed<TimeSeriesData[]>(() => {
		const days = 30
		const data: TimeSeriesData[] = []
		const today = new Date()

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split("T")[0]

			const createdThatDay = tasks.value.filter((t: Task) => {
				return t.createdAt.startsWith(dateStr)
			}).length

			data.push({
				date: dateStr,
				value: createdThatDay,
			})
		}

		return data
	})

	/**
	 * Burndown data (for sprint/agile tracking)
	 */
	const burndownData = computed<TimeSeriesData[]>(() => {
		// Assume 2-week sprint
		const sprintDays = 14
		const data: TimeSeriesData[] = []
		const today = new Date()
		const sprintStart = new Date(today)
		sprintStart.setDate(sprintStart.getDate() - sprintDays)

		// Get total story points or tasks at sprint start
		const totalAtStart = tasks.value.filter((t: Task) => {
			return new Date(t.createdAt) <= sprintStart || t.status !== "Done"
		}).length

		let remaining = totalAtStart

		for (let i = 0; i <= sprintDays; i++) {
			const date = new Date(sprintStart)
			date.setDate(date.getDate() + i)
			const dateStr = date.toISOString().split("T")[0]

			// Count tasks completed on this day
			const completedThatDay = tasks.value.filter((t: Task) => {
				if (t.status !== "Done" || !t.completedAt) return false
				return t.completedAt.startsWith(dateStr)
			}).length

			remaining -= completedThatDay

			data.push({
				date: dateStr,
				value: Math.max(0, remaining),
			})
		}

		return data
	})

	/**
	 * Velocity data (tasks completed per period)
	 */
	const velocityData = computed<{ period: string; completed: number }[]>(() => {
		const periods: Record<string, number> = {}
		const today = new Date()

		for (let i = 11; i >= 0; i--) {
			const date = new Date(today)
			date.setMonth(date.getMonth() - i)
			const periodKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
			periods[periodKey] = 0
		}

		for (const task of tasks.value) {
			if (task.status !== "Done" || !task.completedAt) continue

			const completedDate = new Date(task.completedAt)
			const periodKey = completedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })

			if (periods[periodKey] !== undefined) {
				periods[periodKey]++
			}
		}

		return Object.entries(periods).map(([period, completed]) => ({
			period,
			completed,
		}))
	})

	/**
	 * Productivity metrics
	 */
	const productivityMetrics = computed(() => {
		const total = analytics.value.totalTasks
		const completed = analytics.value.completedTasks
		const completionRate = total > 0 ? (completed / total) * 100 : 0

		const overdue = analytics.value.overdueTasks
		const overdueRate = total > 0 ? (overdue / total) * 100 : 0

		const avgTime = analytics.value.averageCompletionTime

		return {
			completionRate: Math.round(completionRate * 10) / 10,
			overdueRate: Math.round(overdueRate * 10) / 10,
			averageCompletionTime: Math.round(avgTime * 10) / 10,
			tasksPerDay: Math.round((completed / 30) * 10) / 10,
		}
	})

	/**
	 * Format time duration
	 */
	const formatDuration = (minutes: number): string => {
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 8) // Assuming 8-hour work days

		if (days > 0) return `${days}d ${hours % 8}h`
		if (hours > 0) return `${hours}h ${minutes % 60}m`
		return `${minutes}m`
	}

	/**
	 * Get tasks completed in date range
	 */
	const getCompletedInRange = (start: Date, end: Date): Task[] => {
		return tasks.value.filter((t: Task) => {
			if (t.status !== "Done" || !t.completedAt) return false
			const completed = new Date(t.completedAt)
			return completed >= start && completed <= end
		})
	}

	return {
		analytics: readonly(analytics),
		statusChartData: readonly(statusChartData),
		priorityChartData: readonly(priorityChartData),
		assigneeChartData: readonly(assigneeChartData),
		completionTrend: readonly(completionTrend),
		creationTrend: readonly(creationTrend),
		burndownData: readonly(burndownData),
		velocityData: readonly(velocityData),
		productivityMetrics: readonly(productivityMetrics),
		formatDuration,
		getCompletedInRange,
	}
}
