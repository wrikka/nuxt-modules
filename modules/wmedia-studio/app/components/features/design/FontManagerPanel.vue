<script setup lang="ts">
const fonts = ref([
	{ name: "Inter", status: "active", source: "Google" },
	{ name: "Arial", status: "system", source: "Local" },
	{ name: "CustomFont", status: "uploaded", source: "Upload" },
]);
const uploadProgress = ref(0);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Font Manager</h4>
		<div class="space-y-1 mb-2">
			<div
				v-for="f in fonts"
				:key="f.name"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span>{{ f.name }}</span>
				<span
					:class="[
						'px-1.5 py-0.5 rounded',
						f.status === 'active'
							? 'bg-green-100 text-green-700'
							: 'bg-gray-200',
					]"
				>{{ f.status }}</span>
			</div>
		</div>
		<button class="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
			+ Upload Font
		</button>
	</div>
</template>
