<script setup lang="ts">
import type { ProjectNode } from "../../composables/useProjectHierarchy"

const props = defineProps<{
	node: ProjectNode
	selectedNode: string | null
	level?: number
}>()

const emit = defineEmits<{
	toggle: [node: ProjectNode]
	select: [nodeId: string]
}>()

const hasChildren = computed(() => props.node.children.length > 0)

function getNodeIcon(type: ProjectNode["type"]): string {
	const icons: Record<string, string> = {
		workspace: "i-lucide-building-2",
		project: "i-lucide-folder",
		epic: "i-lucide-target",
		task: "i-lucide-check-square",
	}
	return icons[type]
}

function getIndentStyle(level: number) {
	return { paddingLeft: `${(level || 0) * 16 + 12}px` }
}
</script>

<template>
	<div>
		<div
			class="flex items-center gap-2 py-2 rounded cursor-pointer hover:bg-gray-100"
			:class="{ 'bg-blue-50': selectedNode === node.id }"
			:style="getIndentStyle(level || 0)"
			@click="emit('select', node.id)"
		>
			<button
				v-if="hasChildren"
				class="p-1 hover:bg-gray-200 rounded"
				@click.stop="emit('toggle', node)"
			>
				<span
					class="transition-transform"
					:class="[node.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right']"
				/>
			</button>
			<span v-else class="w-7" />

			<span :class="[getNodeIcon(node.type), 'text-gray-500']" />

			<span class="flex-1 truncate" :class="{ 'font-medium': node.type !== 'task' }">
				{{ node.name }}
			</span>

			<span
				v-if="node.count && node.count > 0"
				class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
			>
				{{ node.count }}
			</span>
		</div>

		<div v-if="node.expanded && hasChildren" class="mt-1">
			<ProjectTreeNode
				v-for="child in node.children"
				:key="child.id"
				:node="child"
				:selected-node="selectedNode"
				:level="(level || 0) + 1"
				@toggle="emit('toggle', $event)"
				@select="emit('select', $event)"
			/>
		</div>
	</div>
</template>
