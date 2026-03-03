<script setup lang="ts">
const isResizing = ref(false);
const width = ref(1920);
const height = ref(1080);
const maintainAspect = ref(true);
const quality = ref("high");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Bulk Resize</h4>
		<div class="grid grid-cols-2 gap-2 mb-2">
			<div>
				<label class="text-xs text-gray-500">Width</label>
				<input
					v-model="width"
					type="number"
					class="w-full p-1 border rounded text-sm"
				>
			</div>
			<div>
				<label class="text-xs text-gray-500">Height</label>
				<input
					v-model="height"
					type="number"
					class="w-full p-1 border rounded text-sm"
				>
			</div>
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="maintainAspect" type="checkbox"> Maintain aspect ratio
		</label>
		<button
			:disabled="isResizing"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
			@click="isResizing = true"
		>
			{{ isResizing ? "Processing..." : "Resize All" }}
		</button>
	</div>
</template>
