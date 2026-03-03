<script setup lang="ts">
const items = ref([
	{ id: 1, action: "Moved layer", time: "2 min ago", user: "You" },
	{ id: 2, action: "Added text", time: "5 min ago", user: "John" },
	{ id: 3, action: "Changed color", time: "10 min ago", user: "You" },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Recent Activity</h4>
		<div class="space-y-2">
			<div
				v-for="item in items"
				:key="item.id"
				class="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
			>
				<span>{{ item.action }}</span>
				<div class="text-gray-400">
					<span class="mr-2">{{ item.user }}</span>
					<span>{{ item.time }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
