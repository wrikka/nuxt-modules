<script setup lang="ts">
const shapes = ["Rectangle", "Circle", "Triangle", "Star", "Polygon", "Arrow"];
const selected = ref("Rectangle");
const fill = ref("#3B82F6");
const stroke = ref("#1E40AF");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Shape Builder</h4>
		<div class="grid grid-cols-3 gap-1 mb-2">
			<button
				v-for="s in shapes"
				:key="s"
				:class="[
					'py-1 rounded text-xs',
					selected === s ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = s"
			>
				{{ s }}
			</button>
		</div>
		<div class="flex gap-2">
			<input v-model="fill" type="color" class="w-8 h-8 rounded" title="Fill">
			<input
				v-model="stroke"
				type="color"
				class="w-8 h-8 rounded"
				title="Stroke"
			>
		</div>
	</div>
</template>
