<script setup lang="ts">
const patterns = ["Dots", "Lines", "Grid", "Noise", "Waves", "Hexagon"];
const selected = ref("Dots");
const scale = ref(20);
const opacity = ref(0.5);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Pattern Overlay</h4>
		<div class="grid grid-cols-3 gap-1 mb-2">
			<button
				v-for="p in patterns"
				:key="p"
				:class="[
					'py-1 rounded text-xs',
					selected === p ? 'bg-indigo-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = p"
			>
				{{ p }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Scale: {{ scale }}%</label>
		<input v-model="scale" type="range" min="5" max="100" class="w-full mb-1">
		<label class="text-xs text-gray-500"
		>Opacity: {{ Math.round(opacity * 100) }}%</label>
		<input
			v-model="opacity"
			type="range"
			min="0"
			max="1"
			step="0.1"
			class="w-full"
		>
	</div>
</template>
