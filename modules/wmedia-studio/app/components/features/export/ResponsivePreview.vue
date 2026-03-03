<script setup lang="ts">
const breakpoints = [
	{ name: "Mobile", width: 375, height: 812 },
	{ name: "Tablet", width: 768, height: 1024 },
	{ name: "Desktop", width: 1440, height: 900 },
];
const selected = ref("Desktop");
const rotate = ref(false);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Responsive Preview</h4>
		<div class="space-y-1 mb-2">
			<button
				v-for="b in breakpoints"
				:key="b.name"
				:class="[
					'w-full flex items-center justify-between p-2 rounded text-xs',
					selected === b.name ? 'bg-purple-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = b.name"
			>
				<span>{{ b.name }}</span>
				<span class="opacity-75">{{ b.width }}×{{ b.height }}</span>
			</button>
		</div>
		<label class="flex items-center gap-2 text-xs">
			<input v-model="rotate" type="checkbox"> Rotate device
		</label>
	</div>
</template>
