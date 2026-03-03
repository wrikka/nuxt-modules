<script setup lang="ts">
const isProcessing = ref(false);
const noiseLevel = ref(50);
const smoothness = ref(50);
const preserveDetails = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Noise Reduction</h4>
		<div class="mb-2">
			<label class="text-xs text-gray-500"
			>Noise Level: {{ noiseLevel }}%</label>
			<input v-model="noiseLevel" type="range" min="0" max="100" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Smoothness: {{ smoothness }}%</label>
			<input v-model="smoothness" type="range" min="0" max="100" class="w-full">
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="preserveDetails" type="checkbox"> Preserve details
		</label>
		<button
			:disabled="isProcessing"
			class="w-full py-2 bg-teal-600 text-white rounded text-sm"
			@click="isProcessing = true"
		>
			{{ isProcessing ? "Processing..." : "Apply" }}
		</button>
	</div>
</template>
