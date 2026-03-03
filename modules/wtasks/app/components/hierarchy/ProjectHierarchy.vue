<script setup lang="ts">
import { useProjectHierarchy } from "../../composables/useProjectHierarchy"
import type { ProjectNode } from "../../composables/useProjectHierarchy"

const { filteredTree, selectedNode, searchQuery, toggleNode, selectNode, getNodeIcon } = useProjectHierarchy()

function getNodeColor(type: ProjectNode["type"]): string {
	const colors: Record<string, string> = {
		workspace: "text-gray-700",
		project: "text-blue-600",
		epic: "text-purple-600",
		task: "text-gray-600",
	}
	return colors[type]
}

function getIndentLevel(type: ProjectNode["type"]): number {
	const levels: Record<string, number> = {
		workspace: 0,
		project: 1,
		epic: 2,
		task: 3,
	}
	return levels[type]
}
</script>

<template>
	<div class="project-hierarchy">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold">Project Hierarchy</h3>
		</div>

		<div class="relative mb-4">
			<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 i-lucide-search" />
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search projects, epics, tasks..."
				class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
		</div>

		<div class="space-y-1">
			<template v-for="node in filteredTree" :key="node.id">
				<ProjectTreeNode
					:node="node"
					:selected-node="selectedNode"
					@toggle="toggleNode"
					@select="selectNode"
				/>
			</template>
		</div>
	</div>
</template>
