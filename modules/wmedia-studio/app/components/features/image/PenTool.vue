<script setup lang="ts">
const isPenning = ref(false);
const mode = ref("path");
const modes = ["path", "shape", "pixel"];
const strokeWidth = ref(2);
const strokeColor = ref("#000000");
const fillColor = ref("#FFFFFF");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Pen Tool</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-pink-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="flex gap-2 mb-2">
			<div>
				<label class="text-xs text-gray-500">Stroke</label>
				<input v-model="strokeColor" type="color" class="w-full h-6 rounded">
			</div>
			<div>
				<label class="text-xs text-gray-500">Fill</label>
				<input v-model="fillColor" type="color" class="w-full h-6 rounded">
			</div>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Width: {{ strokeWidth }}px</label>
			<input v-model="strokeWidth" type="range" min="1" max="50" class="w-full">
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isPenning ? 'bg-pink-600' : 'bg-gray-400',
			]"
			@click="isPenning = !isPenning"
		>
			{{ isPenning ? "✓ Drawing" : "Start Drawing" }}
		</button>
	</div>
</template>
