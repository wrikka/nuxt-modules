<script setup lang="ts">
const isExtracting = ref(false);
const texts = ref([
	{ id: 1, content: "Hello World", confidence: 98, bbox: [10, 10, 100, 30] },
	{ id: 2, content: "Sample Text", confidence: 95, bbox: [10, 50, 120, 30] },
]);
const languages = ["English", "Thai", "Chinese", "Japanese", "Korean"];
const selectedLang = ref("English");
const editable = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Text Extractor</h4>
		<select
			v-model="selectedLang"
			class="w-full p-1 border rounded text-xs mb-2"
		>
			<option v-for="l in languages" :key="l">{{ l }}</option>
		</select>
		<div class="space-y-1 mb-2 max-h-24 overflow-y-auto">
			<div
				v-for="t in texts"
				:key="t.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<input
					v-if="editable"
					v-model="t.content"
					class="flex-1 bg-transparent border-b"
				>
				<span v-else class="truncate">{{ t.content }}</span>
				<span class="text-green-600 ml-2">{{ t.confidence }}%</span>
			</div>
		</div>
		<label class="flex items-center gap-2 text-xs mb-2">
			<input v-model="editable" type="checkbox"> Enable editing
		</label>
		<button
			:disabled="isExtracting"
			class="w-full py-2 bg-orange-600 text-white rounded text-sm"
			@click="isExtracting = true"
		>
			{{ isExtracting ? "Extracting..." : "📝 Extract Text" }}
		</button>
	</div>
</template>
