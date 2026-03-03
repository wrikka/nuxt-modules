import type { Task } from "~/shared/types/task"

/**
 * Composable for Time Estimation AI
 */
export const useTimeEstimation = () => {
	const { $toast } = useNuxtApp()

	const estimationHistory = useState<{ taskId: string; actualHours: number; estimatedHours: number }[]>("estimation-history", () => [])
	const isEstimating = useState<boolean>("estimating", () => false)

	/**
	 * Get AI-powered time estimate for a task
	 */
	const getEstimate = async (task: Task): Promise<number | null> => {
		isEstimating.value = true

		try {
			const { data, error } = await useFetch<number>("/api/ai/estimate-time", {
				method: "POST",
				body: {
					title: task.title,
					description: task.description,
					tags: task.tags.map(t => t.name),
					subtaskCount: task.subtasks.length,
				},
			})

			if (error.value) {
				return null
			}

			return data.value || null
		} finally {
			isEstimating.value = false
		}
	}

	/**
	 * Record actual time spent for learning
	 */
	const recordActualTime = async (taskId: string, estimatedHours: number, actualHours: number) => {
		estimationHistory.value.push({
			taskId,
			estimatedHours,
			actualHours,
		})

		// Send to server for ML model training
		await useFetch("/api/ai/record-estimation", {
			method: "POST",
			body: {
				taskId,
				estimatedHours,
				actualHours,
			},
		})
	}

	/**
	 * Get estimation accuracy for user
	 */
	const getEstimationAccuracy = (): { accuracy: number; bias: string } => {
		if (estimationHistory.value.length === 0) {
			return { accuracy: 0, bias: "unknown" }
		}

		let totalError = 0
		let totalOverestimate = 0
		let totalUnderestimate = 0

		for (const record of estimationHistory.value) {
			const error = Math.abs(record.actualHours - record.estimatedHours)
			totalError += error / record.actualHours

			if (record.estimatedHours > record.actualHours) {
				totalOverestimate++
			} else if (record.estimatedHours < record.actualHours) {
				totalUnderestimate++
			}
		}

		const accuracy = Math.max(0, 100 - (totalError / estimationHistory.value.length) * 100)

		let bias = "accurate"
		if (totalOverestimate > totalUnderestimate * 1.5) bias = "overestimating"
		else if (totalUnderestimate > totalOverestimate * 1.5) bias = "underestimating"

		return { accuracy: Math.round(accuracy), bias }
	}

	/**
	 * Get similar tasks for reference
	 */
	const getSimilarTasks = (task: Task, allTasks: Task[]): Task[] => {
		// Find tasks with similar tags or keywords
		const taskTags = new Set(task.tags.map(t => t.name.toLowerCase()))
		const taskKeywords = task.title.toLowerCase().split(" ")

		return allTasks
			.filter(t => t.id !== task.id && t.status === "Done")
			.map(t => {
				const tTags = new Set(t.tags.map(tag => tag.name.toLowerCase()))
				const commonTags = [...taskTags].filter(tag => tTags.has(tag)).length
				const commonKeywords = taskKeywords.filter(kw =>
					t.title.toLowerCase().includes(kw)
				).length

				return { task: t, score: commonTags * 2 + commonKeywords }
			})
			.filter(item => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 5)
			.map(item => item.task)
	}

	/**
	 * Format hours to readable string
	 */
	const formatHours = (hours: number): string => {
		if (hours < 1) return `${Math.round(hours * 60)}m`
		if (hours === Math.floor(hours)) return `${hours}h`
		return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
	}

	return {
		estimationHistory: readonly(estimationHistory),
		isEstimating,
		getEstimate,
		recordActualTime,
		getEstimationAccuracy,
		getSimilarTasks,
		formatHours,
	}
}
