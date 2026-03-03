<script setup lang="ts">
interface Template {
	id: string;
	name: string;
	category: string;
	thumbnail: string;
	author: string;
	likes: number;
	downloads: number;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	selectTemplate: [templateId: string];
}>();

const searchQuery = ref("");
const selectedCategory = ref("all");

const categories = [
	{ id: "all", name: "All" },
	{ id: "social", name: "Social Media" },
	{ id: "web", name: "Web Design" },
	{ id: "print", name: "Print" },
	{ id: "presentation", name: "Presentation" },
];

const templates: Template[] = [
	{
		id: "t1",
		name: "Instagram Post",
		category: "social",
		thumbnail: "",
		author: "Studio",
		likes: 1234,
		downloads: 5678,
	},
	{
		id: "t2",
		name: "YouTube Thumbnail",
		category: "social",
		thumbnail: "",
		author: "Pro Design",
		likes: 890,
		downloads: 3456,
	},
	{
		id: "t3",
		name: "Landing Page",
		category: "web",
		thumbnail: "",
		author: "WebExpert",
		likes: 2341,
		downloads: 7890,
	},
	{
		id: "t4",
		name: "Business Card",
		category: "print",
		thumbnail: "",
		author: "PrintPro",
		likes: 567,
		downloads: 1234,
	},
	{
		id: "t5",
		name: "Pitch Deck",
		category: "presentation",
		thumbnail: "",
		author: "SlideMaster",
		likes: 1890,
		downloads: 4567,
	},
	{
		id: "t6",
		name: "Facebook Cover",
		category: "social",
		thumbnail: "",
		author: "SocialKing",
		likes: 2345,
		downloads: 6789,
	},
	{
		id: "t7",
		name: "E-commerce UI",
		category: "web",
		thumbnail: "",
		author: "ShopDesign",
		likes: 3456,
		downloads: 8901,
	},
	{
		id: "t8",
		name: "Flyer",
		category: "print",
		thumbnail: "",
		author: "PrintHub",
		likes: 789,
		downloads: 2345,
	},
];

const filteredTemplates = computed(() => {
	let filtered = templates;
	if (selectedCategory.value !== "all") {
		filtered = filtered.filter(t => t.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(t => t.name.toLowerCase().includes(query));
	}
	return filtered;
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-5xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div>
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<Icon name="mdi:view-dashboard" class="w-7 h-7 text-blue-500" />
						Template Marketplace
					</h2>
					<p class="text-gray-500 dark:text-gray-400 mt-1">
						Choose from {{ templates.length }}+ professional templates
					</p>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-6 h-6 text-gray-500" />
				</button>
			</div>

			<!-- Filters -->
			<div class="flex items-center gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<div class="relative flex-1 max-w-md">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search templates..."
						class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
					>
				</div>
				<div class="flex gap-2">
					<button
						v-for="cat in categories"
						:key="cat.id"
						:class="[
							'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
							selectedCategory === cat.id
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
						]"
						@click="selectedCategory = cat.id"
					>
						{{ cat.name }}
					</button>
				</div>
			</div>

			<!-- Templates Grid -->
			<div class="flex-1 overflow-y-auto p-6">
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					<div
						v-for="template in filteredTemplates"
						:key="template.id"
						class="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
						@click="emit('selectTemplate', template.id)"
					>
						<!-- Thumbnail -->
						<div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
							<Icon name="mdi:image" class="w-12 h-12 text-gray-400" />
						</div>

						<!-- Info -->
						<div class="p-4">
							<h3 class="font-medium text-gray-900 dark:text-white truncate">
								{{ template.name }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								by {{ template.author }}
							</p>

							<div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
								<span class="flex items-center gap-1">
									<Icon name="mdi:heart" class="w-4 h-4" />
									{{ template.likes.toLocaleString() }}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="mdi:download" class="w-4 h-4" />
									{{ template.downloads.toLocaleString() }}
								</span>
							</div>
						</div>

						<!-- Hover Overlay -->
						<div class="absolute inset-0 bg-blue-500/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<button class="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
								Use Template
							</button>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-if="filteredTemplates.length === 0" class="text-center py-12">
					<Icon
						name="mdi:magnify-close"
						class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
					/>
					<p class="text-gray-500 dark:text-gray-400">No templates found</p>
				</div>
			</div>
		</div>
	</div>
</template>
