<script setup lang="ts">
import { useProjectTemplates } from "~/composables/useProjectTemplates";

const props = defineProps<{
	canvas: any;
}>();

const {
	templates,
	categories,
	selectedCategory,
	applyTemplate,
	loadTemplates,
} = useProjectTemplates(props.canvas);

const emit = defineEmits<{
	close: [];
	select: [templateId: string];
}>();

const searchQuery = ref("");
const selectedTemplate = ref<string | null>(null);

onMounted(() => {
	loadTemplates();
});

const filteredTemplates = computed(() => {
	let result = templates.value;
	if (selectedCategory.value !== "all") {
		result = result.filter((t: any) => t.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter((t: any) =>
			t.name.toLowerCase().includes(query)
			|| t.description.toLowerCase().includes(query)
			|| t.tags.some((tag: string) => tag.toLowerCase().includes(query))
		);
	}
	return result;
});

const handleSelect = async (templateId: string) => {
	selectedTemplate.value = templateId;
	await applyTemplate(templateId);
	emit("select", templateId);
};

const handlePreview = (templateId: string) => {
	selectedTemplate.value = templateId;
};
</script>

<template>
	<div class="templates-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:view-grid" class="w-5 h-5 text-blue-500" />
				Project Templates
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Search -->
		<div class="relative mb-4">
			<Icon
				name="mdi:magnify"
				class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
			/>
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search templates..."
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
			>
		</div>

		<!-- Categories -->
		<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
			<button
				v-for='cat in [
					{ id: "all", label: "All", icon: "mdi:view-grid" },
					...categories.map((c: string) => ({
						id: c,
						label: c,
						icon: "mdi:tag",
					})),
				]'
				:key="cat.id"
				class="px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-2"
				:class="selectedCategory === cat.id
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="selectedCategory = cat.id"
			>
				<span :class="[cat.icon, 'w-4 h-4']" />
				{{ cat.label }}
			</button>
		</div>

		<!-- Templates Grid -->
		<div class="flex-1 overflow-y-auto grid grid-cols-2 gap-3">
			<div
				v-for="template in filteredTemplates"
				:key="template.id"
				class="group relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-blue-500"
				:class="selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''"
				@click="handleSelect(template.id)"
			>
				<!-- Thumbnail -->
				<div class="aspect-video bg-gray-200 dark:bg-gray-600 relative overflow-hidden">
					<img
						v-if="template.thumbnail"
						:src="template.thumbnail"
						class="w-full h-full object-cover"
						:alt="template.name"
					>
					<div
						v-else
						class="w-full h-full flex items-center justify-center"
					>
						<Icon name="mdi:film" class="w-12 h-12 text-gray-400" />
					</div>

					<!-- Overlay -->
					<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
						<button
							class="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
							@click.stop="handlePreview(template.id)"
						>
							<Icon name="mdi:play" class="w-5 h-5 text-white" />
						</button>
					</div>

					<!-- Duration Badge -->
					<div class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
						{{ template.width }}x{{ template.height }}
					</div>
				</div>

				<!-- Info -->
				<div class="p-3">
					<div class="text-gray-900 dark:text-white font-medium text-sm mb-1">
						{{ template.name }}
					</div>
					<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 line-clamp-2">
						{{ template.description }}
					</div>
					<div class="flex flex-wrap gap-1">
						<span
							v-for="tag in template.tags.slice(0, 3)"
							:key="tag"
							class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-600 dark:text-gray-300"
						>
							{{ tag }}
						</span>
					</div>
				</div>

				<!-- Selected Indicator -->
				<div
					v-if="selectedTemplate === template.id"
					class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
				>
					<Icon name="mdi:check" class="w-4 h-4 text-white" />
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
			<div class="text-gray-500 text-sm">
				{{ filteredTemplates.length }} templates
			</div>
			<button
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				:disabled="!selectedTemplate"
				@click="selectedTemplate && handleSelect(selectedTemplate)"
			>
				Create from Template
			</button>
		</div>
	</div>
</template>
