<script setup lang="ts">
const isHealing = ref(false);
const brushSize = ref(25);
const hardness = ref(50);
const spacing = ref(25);
const type = ref("spot");
const types = ["spot", "texture", "smooth"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Healing Brush</h4>
		<div class="flex gap-1 mb-2">
			<button
				v-for="t in types"
				:key="t"
				:class="[
					'flex-1 py-1 rounded text-xs capitalize',
					type === t ? 'bg-green-500 text-white' : 'bg-gray-100',
				]"
				@click="type = t"
			>
				{{ t }}
			</button>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Size: {{ brushSize }}px</label>
			<input v-model="brushSize" type="range" min="1" max="100" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Hardness: {{ hardness }}%</label>
			<input v-model="hardness" type="range" min="0" max="100" class="w-full">
		</div>
		<button
			:class="[
				'w-full py-2 rounded text-sm text-white',
				isHealing ? 'bg-green-600' : 'bg-gray-400',
			]"
			@click="isHealing = !isHealing"
		>
			{{ isHealing ? "✓ Healing Active" : "Activate Healing" }}
		</button>
	</div>
</template>
