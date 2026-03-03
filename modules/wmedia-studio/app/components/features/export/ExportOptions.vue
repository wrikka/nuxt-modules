<script setup lang="ts">
const formats = ["PNG", "JPEG", "WebP", "SVG", "GIF", "MP4", "WebM"];
const selected = ref("PNG");
const quality = ref(90);
const transparent = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Export Options</h4>
		<div class="grid grid-cols-3 gap-1 mb-2">
			<button
				v-for="f in formats"
				:key="f"
				:class="[
					'py-1 rounded text-xs',
					selected === f ? 'bg-green-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = f"
			>
				{{ f }}
			</button>
		</div>
		<label class="text-xs text-gray-500">Quality: {{ quality }}%</label>
		<input v-model="quality" type="range" min="1" max="100" class="w-full mb-2">
		<label class="flex items-center gap-2 text-xs">
			<input v-model="transparent" type="checkbox"> Transparent background
		</label>
	</div>
</template>
