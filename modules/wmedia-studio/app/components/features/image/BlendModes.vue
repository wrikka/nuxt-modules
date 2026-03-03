<script setup lang="ts">
const blendModes = [
	"Normal",
	"Multiply",
	"Screen",
	"Overlay",
	"Darken",
	"Lighten",
	"Color",
	"Luminosity",
];
const selected = ref("Normal");
const opacity = ref(100);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Blend Modes</h4>
		<div class="grid grid-cols-2 gap-1 mb-2">
			<button
				v-for="m in blendModes"
				:key="m"
				:class="[
					'py-1 rounded text-xs',
					selected === m ? 'bg-indigo-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = m"
			>
				{{ m }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Opacity: {{ opacity }}%</label>
		<input v-model="opacity" type="range" min="0" max="100" class="w-full">
	</div>
</template>
