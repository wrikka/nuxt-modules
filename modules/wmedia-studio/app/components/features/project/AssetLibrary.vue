<script setup lang="ts">
const categories = ref(["All", "Photos", "Vectors", "Icons", "Illustrations"]);
const selected = ref("All");
const searchQuery = ref("");
const results = ref([
	{ id: 1, name: "Abstract shape", type: "vector" },
	{ id: 2, name: "Business icon", type: "icon" },
	{ id: 3, name: "Landscape photo", type: "photo" },
]);
</script>
<template>
	<div class="p-3 bg-white rounded-lg border">
		<h4 class="text-sm font-medium mb-2">Asset Library</h4>
		<input
			v-model="searchQuery"
			placeholder="Search assets..."
			class="w-full p-2 border rounded text-sm mb-2"
		>
		<div class="flex flex-wrap gap-1 mb-2">
			<button
				v-for="c in categories"
				:key="c"
				:class="[
					'px-2 py-1 rounded text-xs',
					selected === c ? 'bg-blue-600 text-white' : 'bg-gray-100',
				]"
				@click="selected = c"
			>
				{{ c }}
			</button>
		</div>
		<div class="grid grid-cols-3 gap-2">
			<div
				v-for="r in results"
				:key="r.id"
				class="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500"
			>
				{{ r.type }}
			</div>
		</div>
	</div>
</template>
