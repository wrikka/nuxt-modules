<script setup lang="ts">
import type { Collaboration } from "#shared/types";

const collaborationStore = useCollaborationStore();

const { collaborators } = storeToRefs(collaborationStore);

const getUserColor = (userId: string): string => {
	const colors = [
		"#ef4444",
		"#f97316",
		"#eab308",
		"#22c55e",
		"#06b6d4",
		"#3b82f6",
		"#8b5cf6",
		"#ec4899",
	];
	const index =
		userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
		% colors.length;
	return colors[index]!;
};
</script>

<template>
	<div class="fixed inset-0 pointer-events-none z-40">
		<div
			v-for="([userId, collaborator]) in collaborators"
			:key="userId"
			class="absolute transition-all duration-100"
			:style="{
				left: collaborator.cursor?.x + 'px',
				top: collaborator.cursor?.y + 'px',
			}"
		>
			<div class="flex items-center gap-1">
				<div
					class="w-3 h-3 rounded-full"
					:style="{ backgroundColor: getUserColor(userId) }"
				>
				</div>
				<span class="text-xs bg-gray-800 text-white px-2 py-1 rounded">
					{{ collaborator.userName }}
				</span>
			</div>
		</div>
	</div>
</template>
