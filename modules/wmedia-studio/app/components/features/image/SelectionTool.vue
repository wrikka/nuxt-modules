<script setup lang="ts">
const isSelecting = ref(false);
const mode = ref("magic");
const modes = ["magic", "lasso", "polygon", "quick"];
const tolerance = ref(32);
const feather = ref(0);
const antiAlias = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Selection Tool</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="m in modes"
				:key="m"
				:class="[
					'px-2 py-1 rounded text-xs capitalize',
					mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="mode = m"
			>
				{{ m }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Tolerance: {{ tolerance }}</label>
			<input v-model="tolerance" type="range" min="0" max="255" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Feather: {{ feather }}px</label>
			<input v-model="feather" type="range" min="0" max="50" class="w-full">
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="antiAlias" type="checkbox"> Anti-alias
		</label>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isSelecting ? 'bg-blue-600' : 'bg-gray-400',
			]"
			@click="isSelecting = !isSelecting"
		>
			{{ isSelecting ? "✓ Selecting" : "Start Selection" }}
		</button>
	</div>
</template>
