<script setup lang="ts">
const isPainting = ref(false);
const brushSize = ref(20);
const opacity = ref(100);
const brushType = ref("round");
const types = ["round", "flat", "texture", "airbrush"];
const color = ref("#FF6B6B");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Digital Brush</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'px-2 py-1 rounded text-xs capitalize',
					brushType === t ? 'bg-red-500 text-white' : 'bg-gray-100',
				]"
				@click="brushType = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Size: {{ brushSize }}px</label>
			<input v-model="brushSize" type="range" min="1" max="100" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Opacity: {{ opacity }}%</label>
			<input v-model="opacity" type="range" min="0" max="100" class="w-full">
		</div>
		<input v-model="color" type="color" class="w-full h-8 rounded mb-2">
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isPainting ? 'bg-green-600' : 'bg-red-500',
			]"
			@click="isPainting = !isPainting"
		>
			{{ isPainting ? "✓ Painting" : "Start Painting" }}
		</button>
	</div>
</template>
