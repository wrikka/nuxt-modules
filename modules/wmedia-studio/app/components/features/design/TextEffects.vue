<script setup lang="ts">
const effects = ["Glow", "Neon", "Outline", "Inner Shadow", "Bevel", "Glass"];
const selected = ref("Glow");
const intensity = ref(50);
const color = ref("#00FF00");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Text Effects</h4>
		<div class="grid grid-cols-2 gap-1 mb-2">
			<button
				v-for="e in effects"
				:key="e"
				:class="[
					'py-1 rounded text-xs',
					selected === e ? 'bg-green-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = e"
			>
				{{ e }}
			</button>
		</div>
		<input v-model="color" type="color" class="w-full h-8 rounded mb-2">
		<label class="text-xs text-gray-500">Intensity: {{ intensity }}%</label>
		<input v-model="intensity" type="range" min="0" max="100" class="w-full">
	</div>
</template>
