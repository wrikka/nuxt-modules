<script setup lang="ts">
const watermarkText = ref("© 2024");
const position = ref("bottom-right");
const opacity = ref(50);
const size = ref(20);
const positions = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right",
	"center",
];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Watermark</h4>
		<input
			v-model="watermarkText"
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<div class="grid grid-cols-3 gap-1 mb-2">
			<button
				v-for="p in positions"
				:key="p"
				:class="[
					'py-1 rounded text-[10px] capitalize',
					position === p ? 'bg-gray-800 text-white' : 'bg-gray-100',
				]"
				@click="position = p"
			>
				{{ p.replace("-", " ") }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Opacity: {{ opacity }}%</label>
		<input v-model="opacity" type="range" min="0" max="100" class="w-full mb-1">
		<label class="text-xs text-gray-500">Size: {{ size }}px</label>
		<input v-model="size" type="range" min="10" max="100" class="w-full">
	</div>
</template>
