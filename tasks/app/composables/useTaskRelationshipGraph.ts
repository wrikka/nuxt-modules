import type { Task } from "../../shared/types/task"
import { readonly, ref } from "vue"

export interface GraphNode {
	id: string
	label: string
	x?: number
	y?: number
	type: "task" | "epic"
	status: string
	priority: string
}

export interface GraphEdge {
	source: string
	target: string
	type: "blocks" | "relates_to" | "parent_of"
}

export function useTaskRelationshipGraph() {
	const nodes = ref<GraphNode[]>([])
	const edges = ref<GraphEdge[]>([])
	const isLoading = ref(false)
	const selectedNode = ref<string | null>(null)
	const zoom = ref(1)
	const pan = ref({ x: 0, y: 0 })

	function buildGraph(tasks: Task[]): void {
		nodes.value = tasks.map(t => ({
			id: t.id,
			label: t.title,
			type: t.parentId ? "task" : "epic",
			status: t.status,
			priority: t.priority,
		}))

		edges.value = []

		for (const task of tasks) {
			// Parent-child relationships
			if (task.parentId) {
				edges.value.push({
					source: task.parentId,
					target: task.id,
					type: "parent_of",
				})
			}

			// Dependencies (if task has blockedBy field)
			// This is a placeholder for dependency relationships
		}
	}

	function calculateLayout(): void {
		// Simple force-directed layout simulation
		const width = 800
		const height = 600
		const centerX = width / 2
		const centerY = height / 2

		// Initialize positions in a circle
		const angleStep = (2 * Math.PI) / nodes.value.length
		nodes.value = nodes.value.map((node, i) => ({
			...node,
			x: centerX + Math.cos(i * angleStep) * 200,
			y: centerY + Math.sin(i * angleStep) * 200,
		}))

		// Simple force simulation (simplified)
		for (let iteration = 0; iteration < 50; iteration++) {
			// Repulsion
			for (let i = 0; i < nodes.value.length; i++) {
				for (let j = i + 1; j < nodes.value.length; j++) {
					const dx = nodes.value[j].x! - nodes.value[i].x!
					const dy = nodes.value[j].y! - nodes.value[i].y!
					const dist = Math.sqrt(dx * dx + dy * dy) || 1
					const force = 1000 / (dist * dist)

					nodes.value[i].x! -= (dx / dist) * force
					nodes.value[i].y! -= (dy / dist) * force
					nodes.value[j].x! += (dx / dist) * force
					nodes.value[j].y! += (dy / dist) * force
				}
			}

			// Attraction along edges
			for (const edge of edges.value) {
				const source = nodes.value.find(n => n.id === edge.source)
				const target = nodes.value.find(n => n.id === edge.target)
				if (source && target) {
					const dx = target.x! - source.x!
					const dy = target.y! - source.y!
					const dist = Math.sqrt(dx * dx + dy * dy) || 1
					const force = (dist - 100) * 0.01

					source.x! += (dx / dist) * force
					source.y! += (dy / dist) * force
					target.x! -= (dx / dist) * force
					target.y! -= (dy / dist) * force
				}
			}
		}
	}

	function zoomIn(): void {
		zoom.value = Math.min(zoom.value * 1.2, 3)
	}

	function zoomOut(): void {
		zoom.value = Math.max(zoom.value / 1.2, 0.3)
	}

	function resetView(): void {
		zoom.value = 1
		pan.value = { x: 0, y: 0 }
	}

	function selectNode(nodeId: string): void {
		selectedNode.value = nodeId
	}

	function getNodeColor(node: GraphNode): string {
		const statusColors: Record<string, string> = {
			"Done": "#22c55e",
			"In Progress": "#3b82f6",
			"In Review": "#f59e0b",
			"Backlog": "#6b7280",
		}
		return statusColors[node.status] || "#9ca3af"
	}

	return {
		nodes: readonly(nodes),
		edges: readonly(edges),
		isLoading: readonly(isLoading),
		selectedNode: readonly(selectedNode),
		zoom: readonly(zoom),
		pan: readonly(pan),
		buildGraph,
		calculateLayout,
		zoomIn,
		zoomOut,
		resetView,
		selectNode,
		getNodeColor,
	}
}
