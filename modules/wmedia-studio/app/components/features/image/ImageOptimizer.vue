<script setup lang="ts">
const isCompressing = ref(false);
const quality = ref(80);
const format = ref("webp");
const formats = ["webp", "jpeg", "png", "avif"];
const size = ref({ before: "2.5MB", after: "800KB" });
const keepMeta = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Image Optimizer</h4>
		<div class="grid grid-cols-2 gap-2 mb-2">
			<div class="p-2 bg-gray-50 rounded text-center">
				<div class="text-xs text-gray-500">Before</div>
				<div class="font-medium">{{ size.before }}</div>
			</div>
			<div class="p-2 bg-green-50 rounded text-center">
				<div class="text-xs text-gray-500">After</div>
				<div class="font-medium text-green-600">{{ size.after }}</div>
			</div>
		</div>
		<select v-model="format" class="w-full p-1 border rounded text-xs mb-2">
			<option v-for="f in formats" :key="f">{{ f }}</option>
		</select>
		<div class="mb-2">
			<label class="text-xs text-gray-500">Quality: {{ quality }}%</label>
			<input v-model="quality" type="range" min="1" max="100" class="w-full">
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="keepMeta" type="checkbox"> Keep metadata
		</label>
		<button
			:disabled="isCompressing"
			class="w-full py-2 bg-green-600 text-white rounded text-sm"
			@click="isCompressing = true"
		>
			{{ isCompressing ? "Optimizing..." : "🚀 Optimize" }}
		</button>
	</div>
</template>
