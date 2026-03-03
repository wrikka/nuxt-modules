import type { Task, TaskDependency, RecurringConfig } from "~/shared/types/task"

/**
 * Composable for managing task dependencies
 */
export const useTaskDependencies = () => {
	const { $toast } = useNuxtApp()
	const tasks = useState<Task[]>("tasks", () => [])

	/**
	 * Add a dependency between two tasks
	 */
	const addDependency = async (
		sourceTaskId: string,
		targetTaskId: string,
		type: TaskDependency["type"]
	) => {
		if (sourceTaskId === targetTaskId) {
			$toast.error("Cannot create dependency with itself")
			return false
		}

		// Check for circular dependencies
		if (wouldCreateCircularDependency(sourceTaskId, targetTaskId, type)) {
			$toast.error("Cannot create circular dependency")
			return false
		}

		const dependency: TaskDependency = {
			id: crypto.randomUUID(),
			sourceTaskId,
			targetTaskId,
			type,
		}

		const { error } = await useFetch(`/api/tasks/${targetTaskId}/dependencies`, {
			method: "POST",
			body: dependency,
		})

		if (error.value) {
			$toast.error("Failed to add dependency")
			return false
		}

		// Update local state
		const targetTask = tasks.value.find((t: Task) => t.id === targetTaskId)
		if (targetTask) {
			targetTask.dependencies = [...(targetTask.dependencies || []), dependency]
		}

		$toast.success("Dependency added")
		return true
	}

	/**
	 * Remove a dependency
	 */
	const removeDependency = async (taskId: string, dependencyId: string) => {
		const { error } = await useFetch(`/api/tasks/${taskId}/dependencies/${dependencyId}`, {
			method: "DELETE",
		})

		if (error.value) {
			$toast.error("Failed to remove dependency")
			return false
		}

		// Update local state
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (task?.dependencies) {
			task.dependencies = task.dependencies.filter((d: TaskDependency) => d.id !== dependencyId)
		}

		$toast.success("Dependency removed")
		return true
	}

	/**
	 * Check if adding a dependency would create a circular dependency
	 */
	const wouldCreateCircularDependency = (
		sourceTaskId: string,
		targetTaskId: string,
		type: TaskDependency["type"]
	): boolean => {
		// For "blocks" type: source -> target, need to check if target eventually blocks source
		// For "blockedBy" type: target -> source, need to check if source eventually blocks target

		if (type === "blocks") {
			return hasPath(targetTaskId, sourceTaskId, new Set())
		} else if (type === "blockedBy") {
			return hasPath(sourceTaskId, targetTaskId, new Set())
		}

		return false
	}

	/**
	 * Check if there's a dependency path from start to end using DFS
	 */
	const hasPath = (startId: string, endId: string, visited: Set<string>): boolean => {
		if (startId === endId) return true
		if (visited.has(startId)) return false

		visited.add(startId)

		const task = tasks.value.find((t: Task) => t.id === startId)
		if (!task?.dependencies) return false

		for (const dep of task.dependencies) {
			if (dep.type === "blocks" && dep.targetTaskId === startId) {
				if (hasPath(dep.sourceTaskId, endId, visited)) return true
			} else if (dep.type === "blockedBy" && dep.sourceTaskId === startId) {
				if (hasPath(dep.targetTaskId, endId, visited)) return true
			}
		}

		return false
	}

	/**
	 * Get tasks that are blocked by a specific task
	 */
	const getBlockedTasks = (taskId: string): Task[] => {
		const blocked: Task[] = []

		for (const task of tasks.value) {
			const deps = task.dependencies || []
			const isBlocked = deps.some(
				(d: TaskDependency) => d.sourceTaskId === taskId && d.type === "blocks"
			)
			if (isBlocked) {
				blocked.push(task)
			}
		}

		return blocked
	}

	/**
	 * Get tasks that block a specific task
	 */
	const getBlockingTasks = (taskId: string): Task[] => {
		const task = tasks.value.find((t: Task) => t.id === taskId)
		if (!task?.dependencies) return []

		const blocking: Task[] = []
		for (const dep of task.dependencies) {
			if (dep.type === "blockedBy") {
				const blockingTask = tasks.value.find((t: Task) => t.id === dep.sourceTaskId)
				if (blockingTask) blocking.push(blockingTask)
			} else if (dep.type === "blocks") {
				const blockingTask = tasks.value.find((t: Task) => t.id === dep.targetTaskId)
				if (blockingTask) blocking.push(blockingTask)
			}
		}

		return blocking
	}

	/**
	 * Check if a task is blocked (has uncompleted dependencies)
	 */
	const isTaskBlocked = (taskId: string): boolean => {
		const blockingTasks = getBlockingTasks(taskId)
		return blockingTasks.some((t) => t.status !== "Done" && t.status !== "Cancelled")
	}

	/**
	 * Get dependency chain (all related tasks)
	 */
	const getDependencyChain = (taskId: string): Task[] => {
		const chain = new Set<string>()
		const visited = new Set<string>()

		const traverse = (id: string) => {
			if (visited.has(id)) return
			visited.add(id)
			chain.add(id)

			const task = tasks.value.find((t: Task) => t.id === id)
			if (!task?.dependencies) return

			for (const dep of task.dependencies) {
				if (dep.sourceTaskId === id) {
					traverse(dep.targetTaskId)
				}
				if (dep.targetTaskId === id) {
					traverse(dep.sourceTaskId)
				}
			}
		}

		traverse(taskId)
		chain.delete(taskId)

		return tasks.value.filter((t: Task) => chain.has(t.id))
	}

	/**
	 * Get dependency type label
	 */
	const getDependencyTypeLabel = (type: TaskDependency["type"]): string => {
		switch (type) {
			case "blocks":
				return "blocks"
			case "blockedBy":
				return "is blocked by"
			case "relatesTo":
				return "relates to"
			case "duplicates":
				return "duplicates"
			default:
				return type
		}
	}

	/**
	 * Can start task (all blocking tasks are done)
	 */
	const canStartTask = (taskId: string): boolean => {
		const blockingTasks = getBlockingTasks(taskId)
		return blockingTasks.every((t) => t.status === "Done" || t.status === "Cancelled")
	}

	/**
	 * Get critical path (tasks that directly affect project timeline)
	 */
	const getCriticalPath = (taskId: string): Task[] => {
		const critical: Task[] = []
		const visited = new Set<string>()

		const findCritical = (id: string) => {
			if (visited.has(id)) return
			visited.add(id)

			const blocked = getBlockedTasks(id)
			for (const task of blocked) {
				if (!critical.find((t) => t.id === task.id)) {
					critical.push(task)
					findCritical(task.id)
				}
			}
		}

		findCritical(taskId)
		return critical
	}

	return {
		addDependency,
		removeDependency,
		getBlockedTasks,
		getBlockingTasks,
		isTaskBlocked,
		getDependencyChain,
		getDependencyTypeLabel,
		canStartTask,
		getCriticalPath,
		wouldCreateCircularDependency,
	}
}
