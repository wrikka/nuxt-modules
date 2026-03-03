<script setup lang="ts">
const zoom = ref(100);
const min = 10;
const max = 400;
const presets = [25, 50, 100, 200, 400];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Zoom Control</h4>
		<div class="flex items-center gap-2 mb-2">
			<button
				class="p-1 bg-gray-100 rounded"
				@click="zoom = Math.max(min, zoom - 10)"
			>
				−
			</button>
			<span class="flex-1 text-center text-sm">{{ zoom }}%</span>
			<button
				class="p-1 bg-gray-100 rounded"
				@click="zoom = Math.min(max, zoom + 10)"
			>
				+
			</button>
		</div>
		<div class="flex gap-1">
			<button
				v-for="p in presets"
				:key="p"
				:class="[
					'flex-1 py-1 rounded text-xs',
					zoom === p ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="zoom = p"
			>
				{{ p }}%
			</button>
		</div>
	</div>
</template>
