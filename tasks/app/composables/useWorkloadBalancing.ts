import type { TeamMember } from "~/shared/types/features"
import type { Task } from "~/shared/types/task"

// Nuxt auto-imports
declare const useNuxtApp: typeof import("#app")["useNuxtApp"]
declare const useState: typeof import("#app")["useState"]
declare const useFetch: typeof import("#app")["useFetch"]
declare const readonly: typeof import("vue")["readonly"]

/**
 * Composable for Workload Balancing
 */
export const useWorkloadBalancing = () => {
	const { $toast } = useNuxtApp()

	const workloadData = useState<Record<string, number>>("workload-data", () => ({}))
	const capacityLimits = useState<Record<string, number>>("capacity-limits", () => ({}))
	const overloadThreshold = 8 // tasks per person

	/**
	 * Calculate workload for each team member
	 */
	const calculateWorkload = (tasks: Task[], teamMembers: TeamMember[]) => {
		const workload: Record<string, number> = {}

		for (const member of teamMembers) {
			workload[member.id] = 0
		}
		workload["unassigned"] = 0

		for (const task of tasks) {
			if (task.status === "Done" || task.status === "Cancelled") continue

			const assigneeId = task.assignee ? teamMembers.find(m => m.name === task.assignee?.name)?.id : "unassigned"
			const key = assigneeId || "unassigned"
			workload[key] = (workload[key] || 0) + 1
		}

		workloadData.value = workload
		return workload
	}

	/**
	 * Check if user is overloaded
	 */
	const isOverloaded = (userId: string): boolean => {
		return (workloadData.value[userId] || 0) > (capacityLimits.value[userId] || overloadThreshold)
	}

	/**
	 * Get workload level (low, medium, high, overload)
	 */
	const getWorkloadLevel = (userId: string): "low" | "medium" | "high" | "overload" => {
		const count = workloadData.value[userId] || 0
		const limit = capacityLimits.value[userId] || overloadThreshold

		if (count === 0) return "low"
		if (count > limit) return "overload"
		if (count > limit * 0.8) return "high"
		if (count > limit * 0.5) return "medium"
		return "low"
	}

	/**
	 * Get workload color
	 */
	const getWorkloadColor = (level: ReturnType<typeof getWorkloadLevel>): string => {
		const colors: Record<string, string> = {
			low: "bg-green-100 text-green-800",
			medium: "bg-blue-100 text-blue-800",
			high: "bg-yellow-100 text-yellow-800",
			overload: "bg-red-100 text-red-800",
		}
		return colors[level]
	}

	/**
	 * Set capacity limit for user
	 */
	const setCapacityLimit = (userId: string, limit: number) => {
		capacityLimits.value[userId] = limit
	}

	/**
	 * Auto-distribute tasks
	 */
	const autoDistribute = async (taskIds: string[], teamMemberIds: string[]) => {
		// Calculate current workload
		const sortedMembers = teamMemberIds.sort((a, b) =>
			(workloadData.value[a] || 0) - (workloadData.value[b] || 0)
		)

		// Distribute tasks to least loaded members
		const assignments: Record<string, string> = {}
		for (let i = 0; i < taskIds.length; i++) {
			const memberId = sortedMembers[i % sortedMembers.length]
			assignments[taskIds[i]] = memberId
		}

		// Apply assignments
		const { error } = await useFetch("/api/tasks/bulk-assign", {
			method: "POST",
			body: { assignments },
		})

		if (error.value) {
			$toast.error("Failed to distribute tasks")
			return null
		}

		$toast.success("Tasks distributed evenly")
		return assignments
	}

	/**
	 * Suggest task reassignment
	 */
	const suggestReassignment = (overloadedUserId: string, teamMemberIds: string[]): string | null => {
		const overloadedCount = workloadData.value[overloadedUserId] || 0
		if (overloadedCount <= overloadThreshold) return null

		// Find least loaded member
		let leastLoaded: string | null = null
		let minWorkload = Infinity

		for (const memberId of teamMemberIds) {
			if (memberId === overloadedUserId) continue
			const workload = workloadData.value[memberId] || 0
			if (workload < minWorkload) {
				minWorkload = workload
				leastLoaded = memberId
			}
		}

		return leastLoaded
	}

	/**
	 * Get workload heatmap data
	 */
	const getHeatmapData = (teamMembers: TeamMember[]) => {
		return teamMembers.map(member => ({
			userId: member.id,
			name: member.name,
			workload: workloadData.value[member.id] || 0,
			capacity: capacityLimits.value[member.id] || overloadThreshold,
			level: getWorkloadLevel(member.id),
		}))
	}

	return {
		workloadData: readonly(workloadData),
		capacityLimits: readonly(capacityLimits),
		overloadThreshold,
		calculateWorkload,
		isOverloaded,
		getWorkloadLevel,
		getWorkloadColor,
		setCapacityLimit,
		autoDistribute,
		suggestReassignment,
		getHeatmapData,
	}
}
