import type { Sprint, SprintBurndown } from "~/shared/types/features"
import type { Task } from "~/shared/types/task"

/**
 * Composable for Sprint/Iteration Planning
 */
export const useSprintPlanning = () => {
	const { $toast } = useNuxtApp()

	const sprints = useState<Sprint[]>("sprints", () => [])
	const currentSprint = computed(() => sprints.value.find(s => s.status === "active"))
	const selectedSprint = useState<Sprint | null>("selected-sprint", () => null)
	const burndownData = useState<SprintBurndown | null>("burndown-data", () => null)

	/**
	 * Fetch all sprints
	 */
	const fetchSprints = async () => {
		const { data } = await useFetch<Sprint[]>("/api/sprints")
		if (data.value) sprints.value = data.value
	}

	/**
	 * Create new sprint
	 */
	const createSprint = async (sprintData: Omit<Sprint, "id" | "velocity" | "completedPoints">) => {
		const { data, error } = await useFetch<Sprint>("/api/sprints", {
			method: "POST",
			body: sprintData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create sprint")
			return null
		}

		sprints.value.push(data.value)
		$toast.success("Sprint created")
		return data.value
	}

	/**
	 * Update sprint
	 */
	const updateSprint = async (sprintId: string, updates: Partial<Sprint>) => {
		const { data, error } = await useFetch<Sprint>(`/api/sprints/${sprintId}`, {
			method: "PATCH",
			body: updates,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to update sprint")
			return false
		}

		const index = sprints.value.findIndex(s => s.id === sprintId)
		if (index !== -1) sprints.value[index] = data.value
		return true
	}

	/**
	 * Start sprint
	 */
	const startSprint = async (sprintId: string) => {
		// End any active sprint first
		const active = sprints.value.find(s => s.status === "active")
		if (active) {
			await updateSprint(active.id, { status: "completed" })
		}

		const success = await updateSprint(sprintId, { status: "active" })
		if (success) $toast.success("Sprint started")
		return success
	}

	/**
	 * Complete sprint
	 */
	const completeSprint = async (sprintId: string) => {
		const success = await updateSprint(sprintId, { status: "completed" })
		if (success) $toast.success("Sprint completed")
		return success
	}

	/**
	 * Add task to sprint
	 */
	const addTaskToSprint = async (sprintId: string, taskId: string) => {
		const sprint = sprints.value.find(s => s.id === sprintId)
		if (!sprint) return false

		const updatedTaskIds = [...sprint.taskIds, taskId]
		return await updateSprint(sprintId, { taskIds: updatedTaskIds })
	}

	/**
	 * Remove task from sprint
	 */
	const removeTaskFromSprint = async (sprintId: string, taskId: string) => {
		const sprint = sprints.value.find(s => s.id === sprintId)
		if (!sprint) return false

		const updatedTaskIds = sprint.taskIds.filter(id => id !== taskId)
		return await updateSprint(sprintId, { taskIds: updatedTaskIds })
	}

	/**
	 * Fetch burndown data
	 */
	const fetchBurndownData = async (sprintId: string) => {
		const { data } = await useFetch<SprintBurndown>(`/api/sprints/${sprintId}/burndown`)
		if (data.value) burndownData.value = data.value
	}

	/**
	 * Calculate sprint velocity
	 */
	const calculateVelocity = async (sprintId: string) => {
		const { data } = await useFetch<{ velocity: number; completedPoints: number }>(
			`/api/sprints/${sprintId}/velocity`
		)

		if (data.value) {
			await updateSprint(sprintId, {
				velocity: data.value.velocity,
				completedPoints: data.value.completedPoints,
			})
		}
	}

	/**
	 * Get sprint tasks
	 */
	const getSprintTasks = (sprintId: string, allTasks: Task[]): Task[] => {
		const sprint = sprints.value.find(s => s.id === sprintId)
		if (!sprint) return []
		return allTasks.filter(t => sprint.taskIds.includes(t.id))
	}

	/**
	 * Get sprint progress percentage
	 */
	const getSprintProgress = (sprint: Sprint): number => {
		if (!sprint.taskIds.length) return 0
		// This would need actual task data to calculate properly
		return Math.round(((sprint.completedPoints || 0) / sprint.capacity) * 100)
	}

	/**
	 * Get remaining days in sprint
	 */
	const getRemainingDays = (sprint: Sprint): number => {
		const end = new Date(sprint.endDate)
		const now = new Date()
		const diff = end.getTime() - now.getTime()
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
	}

	return {
		sprints: readonly(sprints),
		currentSprint,
		selectedSprint: readonly(selectedSprint),
		burndownData: readonly(burndownData),
		fetchSprints,
		createSprint,
		updateSprint,
		startSprint,
		completeSprint,
		addTaskToSprint,
		removeTaskFromSprint,
		fetchBurndownData,
		calculateVelocity,
		getSprintTasks,
		getSprintProgress,
		getRemainingDays,
	}
}
