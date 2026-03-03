<script setup lang="ts">
const isScanning = ref(false);
const objects = ref(["Person", "Car", "Dog", "Tree", "Building"]);
const detected = ref([
	{ label: "Person", confidence: 98, bbox: [100, 100, 200, 300] },
	{ label: "Car", confidence: 87, bbox: [300, 200, 500, 350] },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Object Detection</h4>
		<div class="p-2 bg-gray-100 rounded h-20 mb-2 flex items-center justify-center text-xs text-gray-500">
			{{ isScanning ? "🔍 Scanning..." : "Image preview" }}
		</div>
		<div class="space-y-1 mb-2">
			<div
				v-for="d in detected"
				:key="d.label"
				class="flex items-center justify-between p-1 bg-gray-50 rounded text-xs"
			>
				<span>{{ d.label }}</span>
				<span class="text-green-600">{{ d.confidence }}%</span>
			</div>
		</div>
		<button
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isScanning = true"
		>
			Detect Objects
		</button>
	</div>
</template>
