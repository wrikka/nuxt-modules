<script setup lang="ts">
const isDetecting = ref(false);
const scenes = ref([
	{ id: 1, time: "00:00:05", thumbnail: "🎬", confidence: 95 },
	{ id: 2, time: "00:00:32", thumbnail: "🎭", confidence: 88 },
	{ id: 3, time: "00:01:15", thumbnail: "🎪", confidence: 92 },
]);
const sensitivity = ref(50);
const minDuration = ref(2);
</script>

<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Scene Detector</h4>
		<div class="space-y-1 mb-2 max-h-32 overflow-y-auto">
			<div
				v-for="s in scenes"
				:key="s.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="text-lg">{{ s.thumbnail }}</span>
				<span class="font-mono">{{ s.time }}</span>
				<span class="text-green-600">{{ s.confidence }}%</span>
			</div>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500"
			>Sensitivity: {{ sensitivity }}%</label>
			<input
				v-model="sensitivity"
				type="range"
				min="0"
				max="100"
				class="w-full"
			>
		</div>
		<div class="mb-2">
			<label class="text-xs text-gray-500"
			>Min Duration: {{ minDuration }}s</label>
			<input v-model="minDuration" type="range" min="1" max="10" class="w-full">
		</div>
		<button
			:disabled="isDetecting"
			class="w-full py-2 bg-purple-600 text-white rounded text-sm"
			@click="isDetecting = true"
		>
			{{ isDetecting ? "Analyzing..." : "🎬 Detect Scenes" }}
		</button>
	</div>
</template>
