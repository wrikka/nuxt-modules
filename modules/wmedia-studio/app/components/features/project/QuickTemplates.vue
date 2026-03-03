<script setup lang="ts">
const templates = [
	{ id: 1, name: "YouTube Thumbnail", size: "1280x720" },
	{ id: 2, name: "Instagram Post", size: "1080x1080" },
	{ id: 3, name: "Story", size: "1080x1920" },
	{ id: 4, name: "Twitter/X Header", size: "1500x500" },
];
const selected = ref(1);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Quick Templates</h4>
		<div class="space-y-1">
			<button
				v-for="t in templates"
				:key="t.id"
				:class="[
					'w-full flex items-center justify-between p-2 rounded text-sm',
					selected === t.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50',
				]"
				@click="selected = t.id"
			>
				<span>{{ t.name }}</span>
				<span class="text-xs text-gray-400">{{ t.size }}</span>
			</button>
		</div>
	</div>
</template>
