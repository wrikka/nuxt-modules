<script setup lang="ts">
const isCounting = ref(false);
const objects = ref(["person", "car", "animal", "building"]);
const counts = ref([
	{ type: "person", count: 5 },
	{ type: "car", count: 12 },
	{ type: "animal", count: 3 },
]);
const threshold = ref(0.5);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Object Counter</h4>
		<div class="flex flex-wrap gap-1 mb-2">
			<span
				v-for="o in objects"
				:key="o"
				class="px-2 py-1 bg-gray-100 rounded text-xs capitalize"
			>{{ o }}</span>
		</div>
		<div class="space-y-1 mb-2">
			<div
				v-for="c in counts"
				:key="c.type"
				class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
			>
				<span class="capitalize">{{ c.type }}</span>
				<span class="font-bold">{{ c.count }}</span>
			</div>
		</div>
		<button
			:disabled="isCounting"
			class="w-full py-2 bg-cyan-600 text-white rounded text-sm"
			@click="isCounting = true"
		>
			{{ isCounting ? "Counting..." : "🔢 Count Objects" }}
		</button>
	</div>
</template>
