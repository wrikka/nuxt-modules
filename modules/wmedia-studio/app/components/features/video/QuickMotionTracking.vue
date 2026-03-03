<script setup lang="ts">
const isTracking = ref(false);
const trackedObject = ref(null);
const trackingModes = ["Point", "Area", "Object", "Face"];
const selectedMode = ref("Object");
</script>
<template>
	<div class="p-3 bg-white dark:bg-gray-800 rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Motion Tracking</h4>
		<div class="flex gap-2 mb-3">
			<select v-model="selectedMode" class="flex-1 p-2 border rounded text-sm">
				<option v-for="m in trackingModes" :key="m">{{ m }}</option>
			</select>
			<button
				:class="[
					'px-3 py-2 rounded text-sm text-white',
					isTracking ? 'bg-red-500' : 'bg-blue-600',
				]"
				@click="isTracking = !isTracking"
			>
				{{ isTracking ? "Stop" : "Track" }}
			</button>
		</div>
		<div class="p-2 bg-gray-100 rounded h-24 flex items-center justify-center text-sm text-gray-500 mb-2">
			{{ isTracking ? "🔍 Tracking..." : "Click Track to start" }}
		</div>
		<div class="flex gap-1">
			<button class="px-2 py-1 bg-gray-100 rounded text-xs">
				+ Text Label
			</button>
			<button class="px-2 py-1 bg-gray-100 rounded text-xs">+ Effect</button>
			<button class="px-2 py-1 bg-gray-100 rounded text-xs">+ Blur</button>
		</div>
	</div>
</template>
