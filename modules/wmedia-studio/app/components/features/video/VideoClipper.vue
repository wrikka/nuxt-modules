<script setup lang="ts">
const isGenerating = ref(false);
const url = ref("");
const options = ref({
	start: 0,
	end: 10,
	format: "mp4",
	quality: "1080p",
});
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Video Clipper</h4>
		<input
			v-model="url"
			placeholder="Video URL..."
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<div class="grid grid-cols-2 gap-2 mb-2">
			<div>
				<label class="text-xs text-gray-500">Start (s)</label>
				<input
					v-model="options.start"
					type="number"
					class="w-full p-1 border rounded text-xs"
				>
			</div>
			<div>
				<label class="text-xs text-gray-500">End (s)</label>
				<input
					v-model="options.end"
					type="number"
					class="w-full p-1 border rounded text-xs"
				>
			</div>
		</div>
		<select
			v-model="options.quality"
			class="w-full p-1 border rounded text-xs mb-2"
		>
			<option>720p</option>
			<option>1080p</option>
			<option>4K</option>
		</select>
		<button
			:disabled="!url || isGenerating"
			class="w-full py-2 bg-red-600 text-white rounded text-sm"
			@click="isGenerating = true"
		>
			{{ isGenerating ? "Processing..." : "✂️ Clip Video" }}
		</button>
	</div>
</template>
