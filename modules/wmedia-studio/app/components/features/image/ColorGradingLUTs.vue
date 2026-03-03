<script setup lang="ts">
const luts = ref([
	{ id: 1, name: "Cinematic Warm", preview: "bg-orange-400" },
	{ id: 2, name: "Cold Blue", preview: "bg-blue-400" },
	{ id: 3, name: "Vintage", preview: "bg-yellow-600" },
	{ id: 4, name: "Black & White", preview: "bg-gray-600" },
	{
		id: 5,
		name: "Teal & Orange",
		preview: "bg-gradient-to-r from-teal-500 to-orange-500",
	},
]);
const selectedLut = ref(1);
const intensity = ref(0.8);
</script>
<template>
	<div class="p-3 bg-white dark:bg-gray-800 rounded-lg border">
		<h4 class="text-sm font-medium mb-3">Color Grading LUTs</h4>
		<div class="grid grid-cols-3 gap-2 mb-3">
			<button
				v-for="lut in luts"
				:key="lut.id"
				:class="[
					'h-16 rounded relative overflow-hidden',
					lut.preview,
					selectedLut === lut.id ? 'ring-2 ring-blue-500' : '',
				]"
				@click="selectedLut = lut.id"
			>
				<span
					class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1"
				>{{ lut.name }}</span>
			</button>
		</div>
		<div>
			<label class="text-xs text-gray-500"
			>Intensity: {{ Math.round(intensity * 100) }}%</label>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="1"
				step="0.1"
				class="w-full"
			>
		</div>
	</div>
</template>
