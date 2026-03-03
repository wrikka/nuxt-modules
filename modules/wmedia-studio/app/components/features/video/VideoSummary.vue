<script setup lang="ts">
const isAnalyzing = ref(false);
const summary = ref({
	duration: "10:30",
	scenes: 12,
	faces: 5,
	objects: ["car", "building", "tree"],
	audio: "clear",
});
const keyMoments = ref([
	{ time: "01:23", label: "Introduction" },
	{ time: "04:56", label: "Main Content" },
	{ time: "08:30", label: "Conclusion" },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Video Summary</h4>
		<div class="grid grid-cols-2 gap-2 mb-3 text-xs">
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Duration</span>
				<div class="font-medium">{{ summary.duration }}</div>
			</div>
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Scenes</span>
				<div class="font-medium">{{ summary.scenes }}</div>
			</div>
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Faces</span>
				<div class="font-medium">{{ summary.faces }}</div>
			</div>
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Audio</span>
				<div class="font-medium">{{ summary.audio }}</div>
			</div>
		</div>
		<div class="text-xs font-medium mb-1">Key Moments:</div>
		<div class="space-y-1 mb-3">
			<div
				v-for="m in keyMoments"
				:key="m.time"
				class="flex items-center gap-2 p-1 bg-blue-50 rounded text-xs"
			>
				<span class="font-mono text-blue-600">{{ m.time }}</span>
				<span>{{ m.label }}</span>
			</div>
		</div>
		<button
			:disabled="isAnalyzing"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isAnalyzing = true"
		>
			{{ isAnalyzing ? "Analyzing..." : "📊 Generate Summary" }}
		</button>
	</div>
</template>
