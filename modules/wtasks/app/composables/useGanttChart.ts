import type { GanttTask } from "~/shared/types/features"
import type { Task, TaskDependency } from "~/shared/types/task"

/**
 * Composable for Gantt Chart View
 */
export const useGanttChart = () => {
	const { $toast } = useNuxtApp()

	const ganttTasks = useState<GanttTask[]>("gantt-tasks", () => [])
	const viewStartDate = useState<Date>("gantt-view-start", () => {
		const d = new Date()
		d.setDate(d.getDate() - 7)
		return d
	})
	const viewEndDate = useState<Date>("gantt-view-end", () => {
		const d = new Date()
		d.setDate(d.getDate() + 30)
		return d
	})
	const zoomLevel = useState<number>("gantt-zoom", () => 1) // 1 = daily, 7 = weekly, 30 = monthly
	const selectedTask = useState<string | null>("gantt-selected-task", () => null)

	/**
	 * Convert tasks to gantt format
	 */
	const convertToGantt = (tasks: Task[], dependencies: TaskDependency[] = []): GanttTask[] => {
		return tasks.map(task => {
			// Calculate start/end dates from task data
			const start = task.dueDate
				? new Date(new Date(task.dueDate).getTime() - 24 * 60 * 60 * 1000)
				: new Date()
			const end = task.dueDate ? new Date(task.dueDate) : new Date()

			// Calculate progress from subtasks or status
			let progress = task.progress || 0
			if (task.subtasks?.length) {
				const completed = task.subtasks.filter(st => st.completed).length
				progress = Math.round((completed / task.subtasks.length) * 100)
			} else if (task.status === "Done") {
				progress = 100
			}

			// Get dependencies for this task
			const taskDeps = dependencies
				.filter(d => d.targetTaskId === task.id && d.type === "blocks")
				.map(d => d.sourceTaskId)

			return {
				taskId: task.id,
				startDate: start.toISOString(),
				endDate: end.toISOString(),
				progress,
				dependencies: taskDeps,
				milestone: task.status === "Done" && progress === 100,
			}
		})
	}

	/**
	 * Update gantt task dates
	 */
	const updateTaskDates = async (taskId: string, startDate: string, endDate: string) => {
		const ganttTask = ganttTasks.value.find(t => t.taskId === taskId)
		if (!ganttTask) return false

		// Update locally first for responsive UI
		ganttTask.startDate = startDate
		ganttTask.endDate = endDate

		// Sync with server
		const { error } = await useFetch(`/api/tasks/${taskId}`, {
			method: "PATCH",
			body: {
				dueDate: endDate,
				// Store start date in custom field or metadata
			},
		})

		if (error.value) {
			$toast.error("Failed to update task dates")
			return false
		}

		return true
	}

	/**
	 * Update task progress
	 */
	const updateTaskProgress = async (taskId: string, progress: number) => {
		const ganttTask = ganttTasks.value.find(t => t.taskId === taskId)
		if (!ganttTask) return false

		ganttTask.progress = progress

		const { error } = await useFetch(`/api/tasks/${taskId}`, {
			method: "PATCH",
			body: { progress },
		})

		return !error.value
	}

	/**
	 * Get days array for current view
	 */
	const getViewDays = (): Date[] => {
		const days: Date[] = []
		const current = new Date(viewStartDate.value)

		while (current <= viewEndDate.value) {
			days.push(new Date(current))
			current.setDate(current.getDate() + zoomLevel.value)
		}

		return days
	}

	/**
	 * Get task position and width for gantt bar
	 */
	const getTaskBarStyle = (ganttTask: GanttTask): { left: string; width: string } => {
		const start = new Date(ganttTask.startDate)
		const end = new Date(ganttTask.endDate)
		const viewStart = viewStartDate.value
		const viewEnd = viewEndDate.value
		const totalDays = (viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24)

		const startOffset = Math.max(0, (start.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24))
		const duration = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

		const leftPercent = (startOffset / totalDays) * 100
		const widthPercent = (duration / totalDays) * 100

		return {
			left: `${leftPercent}%`,
			width: `${Math.max(widthPercent, 2)}%`,
		}
	}

	/**
	 * Check if task is in critical path
	 */
	const isCriticalPath = (taskId: string): boolean => {
		// Find tasks with no buffer (must be completed on time)
		const task = ganttTasks.value.find(t => t.taskId === taskId)
		if (!task) return false

		// Check if any dependent tasks have tight schedules
		const dependents = ganttTasks.value.filter(t => t.dependencies.includes(taskId))
		return dependents.length > 0 && task.progress < 100
	}

	/**
	 * Pan view left/right
	 */
	const panView = (direction: "left" | "right", days: number = 7) => {
		const offset = direction === "left" ? -days : days
		viewStartDate.value.setDate(viewStartDate.value.getDate() + offset)
		viewEndDate.value.setDate(viewEndDate.value.getDate() + offset)
	}

	/**
	 * Zoom in/out
	 */
	const zoom = (direction: "in" | "out") => {
		const levels = [1, 7, 30] // daily, weekly, monthly
		const currentIndex = levels.indexOf(zoomLevel.value)

		if (direction === "in" && currentIndex > 0) {
			zoomLevel.value = levels[currentIndex - 1]
		} else if (direction === "out" && currentIndex < levels.length - 1) {
			zoomLevel.value = levels[currentIndex + 1]
		}
	}

	return {
		ganttTasks: readonly(ganttTasks),
		viewStartDate,
		viewEndDate,
		zoomLevel,
		selectedTask,
		convertToGantt,
		updateTaskDates,
		updateTaskProgress,
		getViewDays,
		getTaskBarStyle,
		isCriticalPath,
		panView,
		zoom,
	}
}
