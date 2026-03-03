<script setup lang="ts">
const actions = ref([
	{ id: 1, type: "delete", target: "Layer 1", time: "2 min ago" },
	{ id: 2, type: "move", target: "Image", time: "5 min ago" },
	{ id: 3, type: "resize", target: "Text box", time: "10 min ago" },
]);
const canUndo = ref(true);
const canRedo = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">History</h4>
		<div class="flex gap-2 mb-2">
			<button
				:disabled="!canUndo"
				class="flex-1 py-1 bg-gray-100 rounded text-xs disabled:opacity-50"
				@click="canUndo = false;
				canRedo = true;"
			>
				↩ Undo
			</button>
			<button
				:disabled="!canRedo"
				class="flex-1 py-1 bg-gray-100 rounded text-xs disabled:opacity-50"
				@click="canRedo = false;
				canUndo = true;"
			>
				↪ Redo
			</button>
		</div>
		<div class="space-y-1 max-h-32 overflow-y-auto">
			<div
				v-for="a in actions"
				:key="a.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="capitalize">{{ a.type }} {{ a.target }}</span>
				<span class="text-gray-400">{{ a.time }}</span>
			</div>
		</div>
	</div>
</template>
