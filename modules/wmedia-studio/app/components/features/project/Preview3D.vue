<script setup lang="ts">
const views = ["Front", "Back", "Left", "Right", "Top", "Bottom", "Isometric"];
const selected = ref("Isometric");
const rotation = ref(45);
const zoom = ref(100);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">3D Preview</h4>
		<div class="grid grid-cols-3 gap-1 mb-2">
			<button
				v-for="v in views"
				:key="v"
				:class="[
					'py-1 rounded text-xs',
					selected === v ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = v"
			>
				{{ v }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Rotation: {{ rotation }}°</label>
		<input
			v-model="rotation"
			type="range"
			min="0"
			max="360"
			class="w-full mb-1"
		>
		<label class="text-xs text-gray-500">Zoom: {{ zoom }}%</label>
		<input v-model="zoom" type="range" min="50" max="200" class="w-full">
	</div>
</template>
