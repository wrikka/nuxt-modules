<script setup lang="ts">
const isExtracting = ref(false);
const palette = ref(["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"]);
const colorCount = ref(5);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Extract Color Palette</h4>
		<div class="flex gap-1 mb-2">
			<div
				v-for="c in palette"
				:key="c"
				class="flex-1 h-10 rounded"
				:style="{ backgroundColor: c }"
			/>
		</div>
		<label class="text-xs text-gray-500">Colors: {{ colorCount }}</label>
		<input
			v-model="colorCount"
			type="range"
			min="3"
			max="10"
			class="w-full mb-2"
		>
		<button
			:disabled="isExtracting"
			class="w-full py-2 bg-pink-600 text-white rounded text-sm"
			@click="isExtracting = true"
		>
			{{ isExtracting ? "Extracting..." : "🎨 Extract from Image" }}
		</button>
	</div>
</template>
