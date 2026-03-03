<script setup lang="ts">
const dimensions = { width: 1920, height: 1080, dpi: 72 };
const format = ref("PNG");
const colorSpace = ref("sRGB");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Canvas Settings</h4>
		<div class="grid grid-cols-2 gap-2 mb-2 text-xs">
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Width</span>
				<div class="font-medium">{{ dimensions.width }}px</div>
			</div>
			<div class="p-2 bg-gray-50 rounded">
				<span class="text-gray-500">Height</span>
				<div class="font-medium">{{ dimensions.height }}px</div>
			</div>
		</div>
		<div class="flex gap-2">
			<select v-model="format" class="flex-1 p-1 border rounded text-xs">
				<option>PNG</option>
				<option>JPEG</option>
				<option>WebP</option>
			</select>
			<select v-model="colorSpace" class="flex-1 p-1 border rounded text-xs">
				<option>sRGB</option>
				<option>CMYK</option>
				<option>P3</option>
			</select>
		</div>
	</div>
</template>
