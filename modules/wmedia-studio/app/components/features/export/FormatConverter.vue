<script setup lang="ts">
const isConverting = ref(false);
const progress = ref(0);
const inputFormat = ref("HEIC");
const outputFormat = ref("JPEG");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Format Converter</h4>
		<div class="flex items-center gap-2 mb-2">
			<select v-model="inputFormat" class="flex-1 p-1 border rounded text-xs">
				<option>HEIC</option>
				<option>RAW</option>
				<option>PNG</option>
				<option>TIFF</option>
			</select>
			<span>→</span>
			<select v-model="outputFormat" class="flex-1 p-1 border rounded text-xs">
				<option>JPEG</option>
				<option>PNG</option>
				<option>WebP</option>
			</select>
		</div>
		<button
			:disabled="isConverting"
			class="w-full py-2 bg-orange-600 text-white rounded text-sm disabled:opacity-50"
			@click="isConverting = true"
		>
			{{ isConverting ? `Converting ${progress}%...` : "Convert" }}
		</button>
	</div>
</template>
