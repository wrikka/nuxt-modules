<script setup lang="ts">
const isProcessing = ref(false);
const audioFile = ref(null);
const segments = ref([
	{ start: 0, end: 30, label: "Intro" },
	{ start: 30, end: 120, label: "Main" },
	{ start: 120, end: 150, label: "Outro" },
]);
const detectBeats = ref(true);
const detectSilence = ref(true);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Audio Segmenter</h4>
		<div class="p-2 bg-gray-100 rounded h-16 mb-2 flex items-center justify-center text-xs text-gray-500">
			Drop audio file here
		</div>
		<div class="space-y-1 mb-2 max-h-24 overflow-y-auto">
			<div
				v-for="(seg, i) in segments"
				:key="i"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="font-medium">{{ seg.label }}</span>
				<span class="font-mono">{{ seg.start }}s - {{ seg.end }}s</span>
			</div>
		</div>
		<label class="flex items-center gap-2 text-xs mb-1">
			<input v-model="detectBeats" type="checkbox"> Detect beats
		</label>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="detectSilence" type="checkbox"> Detect silence
		</label>
		<button
			:disabled="isProcessing"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isProcessing = true"
		>
			{{ isProcessing ? "Processing..." : "🎵 Segment Audio" }}
		</button>
	</div>
</template>
