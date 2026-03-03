import type { Task } from "../../shared/types/task"
import { readonly, ref } from "vue"

export interface VelocityData {
	date: string
	completed: number
	created: number
}

export interface CycleMetrics {
	totalTasks: number
	completedTasks: number
	completionRate: number
	averageCycleTime: number
	velocityTrend: VelocityData[]
}

export function useCycleAnalytics() {
	const metrics = ref<CycleMetrics | null>(null)
	const isLoading = ref(false)

	function calculateMetrics(tasks: Task[], cycleStart: Date, cycleEnd: Date): CycleMetrics {
		const cycleTasks = tasks.filter(t => {
			const taskDate = new Date(t.date)
			return taskDate >= cycleStart && taskDate <= cycleEnd
		})

		const completed = cycleTasks.filter(t => t.status === "Done")
		const completionRate = cycleTasks.length > 0
			? Math.round((completed.length / cycleTasks.length) * 100)
			: 0

		const cycleTimes = completed.map(t => {
			const created = new Date(t.date)
			const done = new Date(t.updatedAt)
			return Math.ceil((done.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
		})

		const averageCycleTime = cycleTimes.length > 0
			? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length)
			: 0

		// Generate velocity trend (last 7 days)
		const velocityTrend: VelocityData[] = []
		for (let i = 6; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split("T")[0]

			const dayTasks = tasks.filter(t => t.date === dateStr)
			velocityTrend.push({
				date: dateStr,
				completed: dayTasks.filter(t => t.status === "Done").length,
				created: dayTasks.length,
			})
		}

		return {
			totalTasks: cycleTasks.length,
			completedTasks: completed.length,
			completionRate,
			averageCycleTime,
			velocityTrend,
		}
	}

	function generateVelocityChartData(metrics: CycleMetrics) {
		return {
			labels: metrics.velocityTrend.map(d => d.date.slice(5)), // MM-DD
			datasets: [
				{
					label: "Completed",
					data: metrics.velocityTrend.map(d => d.completed),
					borderColor: "#22c55e",
					backgroundColor: "rgba(34, 197, 94, 0.1)",
				},
				{
					label: "Created",
					data: metrics.velocityTrend.map(d => d.created),
					borderColor: "#3b82f6",
					backgroundColor: "rgba(59, 130, 246, 0.1)",
				},
			],
		}
	}

	function getBurndownData(tasks: Task[], sprintDays: number) {
		const total = tasks.length
		const data = []
		let remaining = total

		for (let i = 0; i <= sprintDays; i++) {
			const date = new Date()
			date.setDate(date.getDate() - (sprintDays - i))
			const completed = tasks.filter(t =>
				t.status === "Done" &&
				new Date(t.updatedAt).toDateString() === date.toDateString(),
			).length

			remaining -= completed
			data.push({
				day: i,
				ideal: total - (total / sprintDays) * i,
				actual: Math.max(0, remaining),
			})
		}

		return data
	}

	return {
		metrics: readonly(metrics),
		isLoading: readonly(isLoading),
		calculateMetrics,
		generateVelocityChartData,
		getBurndownData,
	}
}
