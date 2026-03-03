<script setup lang="ts">
const isCloning = ref(false);
const source = ref<{ x: number; y: number } | null>(null);
const target = ref<{ x: number; y: number } | null>(null);
const mode = ref("texture");
const modes = ["texture", "pattern", "heal"];
const brushSize = ref(30);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Clone Stamp</h4>
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
			<label class="text-xs text-gray-500">Brush Size: {{ brushSize }}px</label>
			<input v-model="brushSize" type="range" min="5" max="100" class="w-full">
		</div>
		<div class="flex gap-2 mb-2">
			<button
				class="flex-1 py-2 bg-gray-200 rounded text-xs"
				@click="source = { x: 0, y: 0 }"
			>
				Alt+Click Source
			</button>
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isCloning ? 'bg-teal-600' : 'bg-gray-400',
			]"
			@click="isCloning = !isCloning"
		>
			{{ isCloning ? "✓ Cloning Active" : "Activate Clone" }}
		</button>
	</div>
</template>
