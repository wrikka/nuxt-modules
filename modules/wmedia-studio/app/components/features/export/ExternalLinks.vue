<script setup lang="ts">
const links = ref([
	{ id: 1, url: "https://example.com", title: "Example Site" },
	{ id: 2, url: "https://unsplash.com", title: "Unsplash" },
]);
const newUrl = ref("");
const addLink = () => {
	if (newUrl.value) {
		links.value.push({ id: Date.now(), url: newUrl.value, title: "New Link" });
		newUrl.value = "";
	}
};
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">External Links</h4>
		<div class="flex gap-1 mb-2">
			<input
				v-model="newUrl"
				placeholder="Add URL..."
				class="flex-1 p-1 border rounded text-xs"
			>
			<button
				class="px-2 py-1 bg-blue-600 text-white rounded text-xs"
				@click="addLink"
			>
				+
			</button>
		</div>
		<div class="space-y-1">
			<a
				v-for="l in links"
				:key="l.id"
				:href="l.url"
				target="_blank"
				class="block text-xs p-2 bg-gray-50 rounded hover:bg-gray-100 truncate"
			>{{ l.title }}</a>
		</div>
	</div>
</template>
