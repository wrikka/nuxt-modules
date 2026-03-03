<script setup lang="ts">
const isScanning = ref(false);
const qrContent = ref("");
const generateType = ref("URL");
const types = ["URL", "Text", "Email", "WiFi", "vCard"];
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">QR Code Tool</h4>
		<select
			v-model="generateType"
			class="w-full p-1 border rounded text-xs mb-2"
		>
			<option v-for="t in types" :key="t">{{ t }}</option>
		</select>
		<input
			v-model="qrContent"
			placeholder="Enter content..."
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<div class="flex gap-2">
			<button
				class="flex-1 py-2 bg-gray-800 text-white rounded text-sm"
				@click="isScanning = true"
			>
				📷 Scan
			</button>
			<button class="flex-1 py-2 bg-blue-600 text-white rounded text-sm">
				Generate
			</button>
		</div>
	</div>
</template>
