<script setup lang="ts">
const isFiltering = ref(false);
const brightness = ref(100);
const contrast = ref(100);
const saturation = ref(100);
const temperature = ref(0);
const presets = ["Normal", "Vivid", "Muted", "Noir", "Vintage"];
const selectedPreset = ref("Normal");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Adjustments</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="p in presets"
				:key="p"
				:class="[
					'px-2 py-1 rounded text-xs',
					selectedPreset === p ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selectedPreset = p"
			>
				{{ p }}
			</button>
		</div>
		<div class="space-y-2">
			<div>
				<label class="text-xs text-gray-500"
				>Brightness: {{ brightness }}%</label>
				<input
					v-model="brightness"
					type="range"
					min="0"
					max="200"
					class="w-full"
				>
			</div>
			<div>
				<label class="text-xs text-gray-500">Contrast: {{ contrast }}%</label>
				<input v-model="contrast" type="range" min="0" max="200" class="w-full">
			</div>
			<div>
				<label class="text-xs text-gray-500"
				>Saturation: {{ saturation }}%</label>
				<input
					v-model="saturation"
					type="range"
					min="0"
					max="200"
					class="w-full"
				>
			</div>
		</div>
	</div>
</template>
