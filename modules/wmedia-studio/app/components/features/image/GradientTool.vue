<script setup lang="ts">
const type = ref("linear");
const types = ["linear", "radial", "angle", "reflected"];
const colors = ref(["#FF6B6B", "#4ECDC4"]);
const angle = ref(45);
const scale = ref(100);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Gradient Tool</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					type === t ? 'bg-purple-600 text-white' : 'bg-gray-100',
				]"
				@click="type = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="flex gap-1 mb-2">
			<input v-model="colors[0]" type="color" class="flex-1 h-8 rounded">
			<input v-model="colors[1]" type="color" class="flex-1 h-8 rounded">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Angle: {{ angle }}°</label>
			<input v-model="angle" type="range" min="0" max="360" class="w-full">
		</div>
		<button class="w-full py-2 bg-purple-600 text-white rounded text-sm">
			Apply Gradient
		</button>
	</div>
</template>
