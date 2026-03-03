<script setup lang="ts">
const faces = ref([
	{ id: 1, x: 100, y: 100, width: 50, height: 60 },
	{ id: 2, x: 200, y: 150, width: 45, height: 55 },
]);
const isDetecting = ref(false);
const applyBlur = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Face Detection</h4>
		<div class="p-2 bg-gray-100 rounded h-24 mb-2 flex items-center justify-center text-xs text-gray-500">
			{{ isDetecting ? "🔍 Detecting faces..." : "Click detect to find faces" }}
		</div>
		<div class="text-xs mb-2">Found {{ faces.length }} faces</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="applyBlur" type="checkbox"> Apply face blur
		</label>
		<button
			class="w-full py-2 bg-blue-600 text-white rounded text-sm"
			@click="isDetecting = true"
		>
			Detect Faces
		</button>
	</div>
</template>
