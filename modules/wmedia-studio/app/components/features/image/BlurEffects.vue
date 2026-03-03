<script setup lang="ts">
const blurTypes = ["Gaussian", "Motion", "Radial", "Pixelate"];
const selected = ref("Gaussian");
const intensity = ref(10);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Blur Effects</h4>
		<div class="grid grid-cols-2 gap-1 mb-2">
			<button
				v-for="b in blurTypes"
				:key="b"
				:class="[
					'py-1 rounded text-xs',
					selected === b ? 'bg-purple-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = b"
			>
				{{ b }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Intensity: {{ intensity }}px</label>
		<input v-model="intensity" type="range" min="0" max="50" class="w-full">
	</div>
</template>
