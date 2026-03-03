<script setup lang="ts">
const isPainting = ref(false);
const mode = ref("erase");
const modes = ["erase", "unpaint", "restore"];
const brushSize = ref(30);
const opacity = ref(100);
const hardness = ref(50);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Inpainting Tool</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-teal-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Size: {{ brushSize }}px</label>
			<input v-model="brushSize" type="range" min="5" max="200" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Opacity: {{ opacity }}%</label>
			<input v-model="opacity" type="range" min="0" max="100" class="w-full">
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isPainting ? 'bg-teal-600' : 'bg-gray-400',
			]"
			@click="isPainting = !isPainting"
		>
			{{ isPainting ? "✓ Inpainting" : "Start Inpaint" }}
		</button>
	</div>
</template>
