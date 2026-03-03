<script setup lang="ts">
const items = ref([
	{ id: 1, name: "Logo.png", type: "image", status: "pending" },
	{ id: 2, name: "Banner.jpg", type: "image", status: "processing" },
	{ id: 3, name: "Video.mp4", type: "video", status: "done" },
]);
const actions = ["Resize", "Compress", "Convert", "Add watermark"];
const selectedAction = ref("Resize");
</script>
<template>
	<div class="p-3 bg-white dark:bg-gray-800 rounded-lg border">
		<h4 class="text-sm font-medium mb-3">Batch Actions</h4>
		<div class="flex gap-2 mb-3">
			<select
				v-model="selectedAction"
				class="flex-1 p-2 border rounded text-sm"
			>
				<option v-for="a in actions" :key="a">{{ a }}</option>
			</select>
			<button class="px-3 py-2 bg-blue-600 text-white rounded text-sm">
				Apply All
			</button>
		</div>
		<div class="space-y-1">
			<div
				v-for="item in items"
				:key="item.id"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
			>
				<span>{{ item.name }}</span>
				<span
					:class="[
						'px-2 py-0.5 rounded text-xs',
						item.status === 'done'
							? 'bg-green-100 text-green-700'
							: item.status === 'processing'
							? 'bg-yellow-100 text-yellow-700'
							: 'bg-gray-200',
					]"
				>{{ item.status }}</span>
			</div>
		</div>
	</div>
</template>
