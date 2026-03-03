<script setup lang="ts">
const speed = ref(1.0);
const pitch = ref(1.0);
const preservePitch = ref(true);
const presets = ["Slow-Mo", "Fast", "Reverse", "Freeze"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Time Remap</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="p in presets"
				:key="p"
				class="flex-1 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
			>
				{{ p }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Speed: {{ speed }}x</label>
			<input
				v-model="speed"
				type="range"
				min="0.1"
				max="3"
				step="0.1"
				class="w-full"
			>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Pitch: {{ pitch }}</label>
			<input
				v-model="pitch"
				type="range"
				min="0.5"
				max="2"
				step="0.1"
				class="w-full"
			>
		</div>
		<label class="flex items-center gap-2 text-xs">
			<input v-model="preservePitch" type="checkbox"> Preserve pitch
		</label>
	</div>
</template>
