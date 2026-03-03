<script setup lang="ts">
interface Component {
	id: string;
	name: string;
	category: string;
	thumbnail: string;
	variants: number;
	usage: number;
}

const components = ref<Component[]>([
	{
		id: "1",
		name: "Primary Button",
		category: "Buttons",
		thumbnail: "",
		variants: 4,
		usage: 156,
	},
	{
		id: "2",
		name: "Card",
		category: "Layout",
		thumbnail: "",
		variants: 3,
		usage: 89,
	},
	{
		id: "3",
		name: "Input Field",
		category: "Forms",
		thumbnail: "",
		variants: 2,
		usage: 234,
	},
	{
		id: "4",
		name: "Modal",
		category: "Overlays",
		thumbnail: "",
		variants: 2,
		usage: 45,
	},
	{
		id: "5",
		name: "Avatar",
		category: "Display",
		thumbnail: "",
		variants: 5,
		usage: 178,
	},
]);

const selectedCategory = ref("All");
const categories = ["All", "Buttons", "Layout", "Forms", "Overlays", "Display"];

const filteredComponents = computed(() => {
	if (selectedCategory.value === "All") return components.value;
	return components.value.filter(c => c.category === selectedCategory.value);
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Component Library
			</h3>
			<button class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
				+ New Component
			</button>
		</div>

		<!-- Category Filter -->
		<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
			<button
				v-for="cat in categories"
				:key="cat"
				@click="selectedCategory = cat"
				:class="{
					'bg-blue-500 text-white': selectedCategory === cat,
					'bg-gray-100 dark:bg-gray-700': selectedCategory !== cat,
				}"
				class="px-3 py-1 rounded-lg text-sm whitespace-nowrap"
			>
				{{ cat }}
			</button>
		</div>

		<!-- Component Grid -->
		<div class="grid grid-cols-2 gap-3">
			<div
				v-for="comp in filteredComponents"
				:key="comp.id"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:ring-2 ring-blue-500 cursor-pointer transition-all"
			>
				<!-- Thumbnail Preview -->
				<div class="h-16 bg-gray-200 dark:bg-gray-600 rounded mb-2 flex items-center justify-center">
					<Icon name="mdi:puzzle" class="w-8 h-8 text-gray-400" />
				</div>
				<div class="flex items-start justify-between">
					<div>
						<p class="font-medium text-sm">{{ comp.name }}</p>
						<p class="text-xs text-gray-500">{{ comp.category }}</p>
					</div>
					<div class="text-right">
						<p class="text-xs text-blue-500">{{ comp.variants }} variants</p>
						<p class="text-xs text-gray-400">Used {{ comp.usage }}x</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
