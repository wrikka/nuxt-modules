import type { Task } from "../../shared/types/task"
import { computed, readonly, ref } from "vue"

export interface ProjectNode {
	id: string
	name: string
	type: "workspace" | "project" | "epic" | "task"
	children: ProjectNode[]
	task?: Task
	expanded?: boolean
	count?: number
}

export function useProjectHierarchy() {
	const treeData = ref<ProjectNode[]>([])
	const selectedNode = ref<string | null>(null)
	const isLoading = ref(false)
	const searchQuery = ref("")

	function buildHierarchy(tasks: Task[]): ProjectNode[] {
		const workspace: ProjectNode = {
			id: "workspace",
			name: "My Workspace",
			type: "workspace",
			children: [],
			expanded: true,
		}

		const projects = new Map<string, ProjectNode>()
		const epics = new Map<string, ProjectNode>()

		for (const task of tasks) {
			// Group by list/project
			const listId = task.list || "default"
			if (!projects.has(listId)) {
				projects.set(listId, {
					id: listId,
					name: listId === "default" ? "General" : listId,
					type: "project",
					children: [],
					expanded: false,
				})
			}

			const project = projects.get(listId)!

			// Check if task has parent (epic)
			if (task.parentId) {
				if (!epics.has(task.parentId)) {
					epics.set(task.parentId, {
						id: task.parentId,
						name: "Epic",
						type: "epic",
						children: [],
						expanded: false,
					})
				}
				epics.get(task.parentId)!.children.push({
					id: task.id,
					name: task.title,
					type: "task",
					children: [],
					task,
				})
			}
			else {
				project.children.push({
					id: task.id,
					name: task.title,
					type: "task",
					children: [],
					task,
				})
			}
		}

		// Add epics to their projects
		for (const epic of epics.values()) {
			const project = Array.from(projects.values()).find(p =>
				epic.children.some(child => child.task?.list === p.id),
			)
			if (project) {
				project.children.push(epic)
			}
		}

		// Calculate counts
		function countTasks(node: ProjectNode): number {
			if (node.type === "task") return 1
			node.count = node.children.reduce((sum, child) => sum + countTasks(child), 0)
			return node.count
		}

		workspace.children = Array.from(projects.values())
		workspace.children.forEach(countTasks)

		return [workspace]
	}

	function toggleNode(node: ProjectNode) {
		node.expanded = !node.expanded
	}

	function selectNode(nodeId: string) {
		selectedNode.value = nodeId
	}

	const filteredTree = computed(() => {
		if (!searchQuery.value) return treeData.value

		function filterNode(node: ProjectNode): ProjectNode | null {
			const matches = node.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			const filteredChildren = node.children
				.map(filterNode)
				.filter((n): n is ProjectNode => n !== null)

			if (matches || filteredChildren.length > 0) {
				return { ...node, children: filteredChildren, expanded: true }
			}
			return null
		}

		return treeData.value.map(filterNode).filter((n): n is ProjectNode => n !== null)
	})

	function getNodeIcon(type: ProjectNode["type"]): string {
		const icons: Record<string, string> = {
			workspace: "i-lucide-building-2",
			project: "i-lucide-folder",
			epic: "i-lucide-target",
			task: "i-lucide-check-square",
		}
		return icons[type]
	}

	return {
		treeData: readonly(treeData),
		filteredTree,
		selectedNode: readonly(selectedNode),
		searchQuery,
		isLoading: readonly(isLoading),
		buildHierarchy,
		toggleNode,
		selectNode,
		getNodeIcon,
	}
}
