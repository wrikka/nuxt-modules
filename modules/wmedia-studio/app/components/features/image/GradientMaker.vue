<script setup lang="ts">
const gradients = [
	{ id: 1, name: "Sunset", colors: ["#FF6B6B", "#FFE66D"] },
	{ id: 2, name: "Ocean", colors: ["#4ECDC4", "#44A08D"] },
	{ id: 3, name: "Berry", colors: ["#8E44AD", "#C0392B"] },
];
const selected = ref(1);
const angle = ref(45);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Gradient Maker</h4>
		<div class="space-y-1 mb-2">
			<button
				v-for="g in gradients"
				:key="g.id"
				:class="[
					'w-full h-8 rounded flex items-center justify-center text-xs text-white font-medium',
					selected === g.id ? 'ring-2 ring-gray-800' : '',
				]"
				:style="{
					background: `linear-gradient(${angle}deg, ${g.colors[0]}, ${
						g.colors[1]
					})`,
				}"
				@click="selected = g.id"
			>
				{{ g.name }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Angle: {{ angle }}°</label>
		<input v-model="angle" type="range" min="0" max="360" class="w-full">
	</div>
</template>
