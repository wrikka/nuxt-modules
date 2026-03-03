<script setup lang="ts">
const stickers = ["🔥", "👍", "❤️", "🎉", "🤔", "👀"];
const reactions = ref([
	{ id: 1, user: "John", emoji: "🔥", time: "2m ago" },
	{ id: 2, user: "Sarah", emoji: "👍", time: "5m ago" },
]);
const selectedEmoji = ref("🔥");
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Quick Reactions</h4>
		<div class="flex gap-1 mb-3">
			<button
				v-for="s in stickers"
				:key="s"
				:class="[
					'text-lg p-1 rounded hover:bg-gray-100',
					selectedEmoji === s ? 'bg-yellow-100' : '',
				]"
				@click="selectedEmoji = s"
			>
				{{ s }}
			</button>
		</div>
		<div class="space-y-1">
			<div
				v-for="r in reactions"
				:key="r.id"
				class="flex items-center gap-2 text-xs p-1 hover:bg-gray-50 rounded"
			>
				<span class="text-lg">{{ r.emoji }}</span>
				<span>{{ r.user }}</span>
				<span class="text-gray-400 ml-auto">{{ r.time }}</span>
			</div>
		</div>
	</div>
</template>
