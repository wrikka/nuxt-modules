<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const templates = [
	{
		id: "1",
		name: "YouTube Vlog",
		category: "Social",
		duration: "10-15 min",
		scenes: 8,
		thumbnail: "vlog",
	},
	{
		id: "2",
		name: "Product Review",
		category: "Social",
		duration: "5-8 min",
		scenes: 5,
		thumbnail: "review",
	},
	{
		id: "3",
		name: "Tutorial Series",
		category: "Education",
		duration: "15-20 min",
		scenes: 12,
		thumbnail: "tutorial",
	},
	{
		id: "4",
		name: "Short Film",
		category: "Cinema",
		duration: "10-30 min",
		scenes: 20,
		thumbnail: "film",
	},
	{
		id: "5",
		name: "Podcast Video",
		category: "Audio",
		duration: "30-60 min",
		scenes: 4,
		thumbnail: "podcast",
	},
	{
		id: "6",
		name: "Music Video",
		category: "Music",
		duration: "3-5 min",
		scenes: 15,
		thumbnail: "music",
	},
];

const categories = ["All", "Social", "Education", "Cinema", "Audio", "Music"];
const selectedCategory = ref("All");

const filteredTemplates = computed(() => {
	if (selectedCategory.value === "All") return templates;
	return templates.filter(t => t.category === selectedCategory.value);
});

const useTemplate = (id: string) => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Project Templates"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Save entire project structures as reusable templates for faster
				workflow.
			</p>

			<!-- Category Filter -->
			<div class="flex gap-2 flex-wrap">
				<button
					v-for="cat in categories"
					:key="cat"
					class="px-3 py-1 rounded-full text-sm transition-colors"
					:class="selectedCategory === cat
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'"
					@click="selectedCategory = cat"
				>
					{{ cat }}
				</button>
			</div>

			<!-- Templates Grid -->
			<div class="grid grid-cols-2 gap-3">
				<div
					v-for="template in filteredTemplates"
					:key="template.id"
					class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
				>
					<div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
						<Icon name="mdi:folder" class="w-10 h-10 text-gray-400" />
					</div>
					<h4 class="font-medium text-gray-900 dark:text-white">
						{{ template.name }}
					</h4>
					<div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
						<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{{
							template.category
						}}</span>
						<span>{{ template.duration }}</span>
						<span>{{ template.scenes }} scenes</span>
					</div>
					<button
						class="w-full mt-3 px-3 py-1.5 bg-blue-500 text-white rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
						@click="useTemplate(template.id)"
					>
						Use Template
					</button>
				</div>
			</div>

			<!-- Save Current -->
			<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
				<button class="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
					<Icon name="mdi:plus" class="w-5 h-5" />
					Save Current Project as Template
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
