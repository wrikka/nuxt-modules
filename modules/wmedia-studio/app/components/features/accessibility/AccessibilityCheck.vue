<script setup lang="ts">
const isScanning = ref(false);
const issues = ref([
	{ id: 1, type: "low-contrast", element: "Button", severity: "warning" },
	{ id: 2, type: "missing-alt", element: "Image", severity: "error" },
	{ id: 3, type: "small-text", element: "Label", severity: "warning" },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Accessibility Check</h4>
		<button
			:disabled="isScanning"
			class="w-full py-2 bg-blue-600 text-white rounded text-sm mb-2"
			@click="isScanning = true"
		>
			{{ isScanning ? "🔍 Scanning..." : "Scan for Issues" }}
		</button>
		<div class="space-y-1 max-h-32 overflow-y-auto">
			<div
				v-for="i in issues"
				:key="i.id"
				class="flex items-center justify-between p-2 rounded text-xs"
				:class="i.severity === 'error' ? 'bg-red-50' : 'bg-yellow-50'"
			>
				<span>{{ i.type }} on {{ i.element }}</span>
				<span
					:class="[
						'px-1.5 rounded',
						i.severity === 'error'
							? 'bg-red-200 text-red-700'
							: 'bg-yellow-200 text-yellow-700',
					]"
				>{{ i.severity }}</span>
			</div>
		</div>
	</div>
</template>
