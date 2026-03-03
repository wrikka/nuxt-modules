<script setup lang="ts">
const isScanning = ref(false);
const codes = ref([
	{ type: "QR", content: "https://example.com", position: "top-left" },
	{ type: "Barcode", content: "123456789", position: "center" },
]);
const generateContent = ref("");
const codeType = ref("QR");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Code Scanner</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="c in codes"
				:key="c.content"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="font-bold">{{ c.type }}</span>
				<span class="truncate max-w-[100px]">{{ c.content }}</span>
			</div>
		</div>
		<input
			v-model="generateContent"
			placeholder="Content to encode..."
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<div class="flex gap-2">
			<button class="flex-1 py-2 bg-gray-800 text-white rounded text-sm">
				📷 Scan
			</button>
			<button class="flex-1 py-2 bg-blue-600 text-white rounded text-sm">
				Generate
			</button>
		</div>
	</div>
</template>
