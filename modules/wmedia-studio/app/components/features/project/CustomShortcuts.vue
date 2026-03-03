<script setup lang="ts">
const shortcuts = ref({
	copy: "Ctrl+C",
	paste: "Ctrl+V",
	undo: "Ctrl+Z",
	redo: "Ctrl+Y",
	save: "Ctrl+S",
});
const isEditing = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Custom Shortcuts</h4>
		<div class="space-y-1">
			<div
				v-for="(key, action) in shortcuts"
				:key="action"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="capitalize">{{ action }}</span>
				<kbd class="px-2 py-1 bg-white border rounded font-mono">{{ key }}</kbd>
			</div>
		</div>
		<button
			class="w-full mt-2 py-2 bg-gray-800 text-white rounded text-sm"
			@click="isEditing = true"
		>
			Edit Shortcuts
		</button>
	</div>
</template>
