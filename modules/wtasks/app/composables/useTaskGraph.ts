import type { Task } from "~/shared/types/task"

/**
 * Composable for Task Relationships Graph
 */
export const useTaskGraph = () => {
	const graphData = useState<{
		nodes: { id: string; label: string; status: string; x?: number; y?: number }[]
		edges: { source: string; target: string; type: string }[]
	}>("task-graph", () => ({ nodes: [], edges: [] }))

	const selectedNode = useState<string | null>("selected-graph-node", () => null)
	const zoomLevel = useState<number>("graph-zoom", () => 1)

	/**
	 * Build graph from tasks and dependencies
	 */
	const buildGraph = (tasks: Task[]) => {
		const nodes = tasks.map(task => ({
			id: task.id,
			label: task.title,
			status: task.status,
			x: Math.random() * 800,
			y: Math.random() * 600,
		}))

		const edges: { source: string; target: string; type: string }[] = []

		for (const task of tasks) {
			if (task.dependencies) {
				for (const dep of task.dependencies) {
					edges.push({
						source: dep.sourceTaskId,
						target: dep.targetTaskId,
						type: dep.type,
					})
				}
			}

			// Parent-child relationships
			if (task.parentTaskId) {
				edges.push({
					source: task.parentTaskId,
					target: task.id,
					type: "parent-child",
				})
			}
		}

		graphData.value = { nodes, edges }
	}

	/**
	 * Get node color based on status
	 */
	const getNodeColor = (status: string): string => {
		const colors: Record<string, string> = {
			"Done": "#34d399",
			"In Progress": "#fbbf24",
			"In Review": "#60a5fa",
			"Backlog": "#94a3b8",
			"Cancelled": "#f87171",
		}
		return colors[status] || "#94a3b8"
	}

	/**
	 * Get edge color based on type
	 */
	const getEdgeColor = (type: string): string => {
		const colors: Record<string, string> = {
			"blocks": "#ef4444",
			"blockedBy": "#f59e0b",
			"relatesTo": "#3b82f6",
			"duplicates": "#8b5cf6",
			"parent-child": "#6b7280",
		}
		return colors[type] || "#6b7280"
	}

	/**
	 * Get connected nodes
	 */
	const getConnectedNodes = (nodeId: string): string[] => {
		const connected = new Set<string>()

		for (const edge of graphData.value.edges) {
			if (edge.source === nodeId) connected.add(edge.target)
			if (edge.target === nodeId) connected.add(edge.source)
		}

		return [...connected]
	}

	/**
	 * Get dependency chain
	 */
	const getDependencyChain = (nodeId: string, direction: "up" | "down" | "both" = "both"): string[] => {
		const chain = new Set<string>()
		const visited = new Set<string>()

		const traverse = (id: string) => {
			if (visited.has(id)) return
			visited.add(id)
			chain.add(id)

			for (const edge of graphData.value.edges) {
				if (direction === "up" || direction === "both") {
					if (edge.target === id) traverse(edge.source)
				}
				if (direction === "down" || direction === "both") {
					if (edge.source === id) traverse(edge.target)
				}
			}
		}

		traverse(nodeId)
		chain.delete(nodeId)
		return [...chain]
	}

	/**
	 * Zoom in/out
	 */
	const zoom = (direction: "in" | "out") => {
		if (direction === "in") zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
		else zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
	}

	/**
	 * Reset zoom
	 */
	const resetZoom = () => {
		zoomLevel.value = 1
	}

	/**
	 * Select node
	 */
	const selectNode = (nodeId: string | null) => {
		selectedNode.value = nodeId
	}

	/**
	 * Filter graph by status
	 */
	const filterByStatus = (statuses: string[]) => {
		if (statuses.length === 0) return graphData.value.nodes
		return graphData.value.nodes.filter(n => statuses.includes(n.status))
	}

	return {
		graphData: readonly(graphData),
		selectedNode,
		zoomLevel,
		buildGraph,
		getNodeColor,
		getEdgeColor,
		getConnectedNodes,
		getDependencyChain,
		zoom,
		resetZoom,
		selectNode,
		filterByStatus,
	}
}
