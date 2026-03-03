<script setup lang="ts">
const isComparing = ref(false);
const beforeImage = ref("");
const afterImage = ref("");
const sliderPosition = ref(50);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Before/After Compare</h4>
		<div class="relative h-32 bg-gray-100 rounded mb-2 overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
				Drop images to compare
			</div>
			<div
				v-if="isComparing"
				class="absolute inset-y-0 bg-blue-500/20 border-r-2 border-blue-500"
				:style="{ left: 0, width: sliderPosition + '%' }"
			/>
		</div>
		<label class="text-xs text-gray-500">Slider: {{ sliderPosition }}%</label>
		<input
			v-model="sliderPosition"
			type="range"
			min="0"
			max="100"
			class="w-full"
		>
	</div>
</template>
