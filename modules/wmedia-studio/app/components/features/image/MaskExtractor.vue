<script setup lang="ts">
const isExtracting = ref(false);
const objects = ref([
	{ id: 1, name: "person", mask: true, color: "#FF6B6B" },
	{ id: 2, name: "car", mask: true, color: "#4ECDC4" },
	{ id: 3, name: "sky", mask: false, color: "#45B7D1" },
]);
const threshold = ref(50);
const feather = ref(10);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Mask Extractor</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="obj in objects"
				:key="obj.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded" :style="{ background: obj.color }"></div>
					<span class="capitalize">{{ obj.name }}</span>
				</div>
				<input v-model="obj.mask" type="checkbox">
			</div>
		</div>
		<div class="mb-1">
			<label class="text-xs text-gray-500">Threshold: {{ threshold }}%</label>
			<input v-model="threshold" type="range" min="0" max="100" class="w-full">
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Feather: {{ feather }}px</label>
			<input v-model="feather" type="range" min="0" max="50" class="w-full">
		</div>
		<button
			:disabled="isExtracting"
			class="w-full py-2 bg-teal-600 text-white rounded text-sm"
			@click="isExtracting = true"
		>
			{{ isExtracting ? "Extracting..." : "🎯 Extract Masks" }}
		</button>
	</div>
</template>
