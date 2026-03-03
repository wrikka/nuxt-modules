<script setup lang="ts">
const isAdjusting = ref(false);
const hue = ref(0);
const saturation = ref(100);
const lightness = ref(0);
const preview = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">HSL Adjust</h4>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Hue: {{ hue }}°</label>
			<input v-model="hue" type="range" min="-180" max="180" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Saturation: {{ saturation }}%</label>
			<input v-model="saturation" type="range" min="0" max="200" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Lightness: {{ lightness }}%</label>
			<input
				v-model="lightness"
				type="range"
				min="-100"
				max="100"
				class="w-full"
			>
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="preview" type="checkbox"> Live preview
		</label>
		<button
			:disabled="isAdjusting"
			class="w-full py-2 bg-pink-600 text-white rounded text-sm"
			@click="isAdjusting = true"
		>
			{{ isAdjusting ? "Applying..." : "Apply HSL" }}
		</button>
	</div>
</template>
