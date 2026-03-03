<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "select", templateId: string): void;
	(e: "compare", templateIds: string[]): void;
}>();

const selectedTemplates = ref<string[]>([]);
const comparisonMode = ref(false);

const comparisonTemplates = computed(() => {
	return props.templates.filter(t => selectedTemplates.value.includes(t.id))
		.slice(0, 3);
});

const toggleSelection = (templateId: string) => {
	const index = selectedTemplates.value.indexOf(templateId);
	if (index > -1) {
		selectedTemplates.value.splice(index, 1);
	} else if (selectedTemplates.value.length < 3) {
		selectedTemplates.value.push(templateId);
	}
};

const startComparison = () => {
	if (selectedTemplates.value.length >= 2) {
		comparisonMode.value = true;
	}
};

const closeComparison = () => {
	comparisonMode.value = false;
	selectedTemplates.value = [];
};

const comparisonFeatures = [
	{
		id: "dimensions",
		name: "Dimensions",
		getValue: (t: Template) => `${t.width} × ${t.height}`,
	},
	{ id: "category", name: "Category", getValue: (t: Template) => t.category },
	{ id: "rating", name: "Rating", getValue: (t: Template) => `★ ${t.rating}` },
	{
		id: "uses",
		name: "Usage Count",
		getValue: (t: Template) => t.usageCount.toLocaleString(),
	},
	{
		id: "premium",
		name: "Type",
		getValue: (t: Template) => t.isPremium ? "Premium" : "Free",
	},
	{
		id: "tags",
		name: "Tags",
		getValue: (t: Template) => t.tags.slice(0, 3).join(", ") || "-",
	},
	{
		id: "elements",
		name: "Elements",
		getValue: (t: Template) => `${t.elements.length} items`,
	},
	{
		id: "updated",
		name: "Last Updated",
		getValue: (t: Template) => new Date(t.updatedAt).toLocaleDateString(),
	},
];

const getBestTemplate = () => {
	if (comparisonTemplates.value.length === 0) return null;
	return comparisonTemplates.value.reduce((best, current) =>
		(current.rating > best.rating
				|| (current.rating === best.rating
					&& current.usageCount > best.usageCount))
			? current
			: best
	);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-4">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							{{
								comparisonMode
								? "Template Comparison"
								: "Select Templates to Compare"
							}}
						</h2>
						<span v-if="!comparisonMode" class="text-sm text-gray-500">
							Select 2-3 templates ({{ selectedTemplates.length }}/3)
						</span>
					</div>
					<div class="flex items-center gap-2">
						<template v-if="!comparisonMode">
							<button
								v-if="selectedTemplates.length > 0"
								class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
								@click="selectedTemplates = []"
							>
								Clear
							</button>
							<button
								class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								:disabled="selectedTemplates.length < 2"
								@click="startComparison"
							>
								Compare ({{ selectedTemplates.length }})
							</button>
						</template>
						<template v-else>
							<button
								class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
								@click="closeComparison"
							>
								Back to Selection
							</button>
						</template>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Template Selection Grid -->
				<div v-if="!comparisonMode" class="flex-1 overflow-y-auto p-6">
					<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						<div
							v-for="template in templates"
							:key="template.id"
							class="relative group cursor-pointer"
							@click="toggleSelection(template.id)"
						>
							<div
								class="aspect-video rounded-xl overflow-hidden border-2 transition-all"
								:class="selectedTemplates.includes(template.id)
								? 'border-blue-500 ring-2 ring-blue-500'
								: 'border-gray-200 dark:border-gray-700 hover:border-blue-300'"
							>
								<img
									:src="template.thumbnail"
									:alt="template.name"
									class="w-full h-full object-cover"
								/>
								<div
									v-if="selectedTemplates.includes(template.id)"
									class="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
								>
									<i class="i-mdi-check" />
								</div>
							</div>
							<div class="mt-2">
								<h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
									{{ template.name }}
								</h3>
								<div class="flex items-center gap-2 text-xs text-gray-500">
									<span>★ {{ template.rating }}</span>
									<span>{{ template.usageCount.toLocaleString() }} uses</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Comparison View -->
				<div v-else class="flex-1 overflow-auto p-6">
					<div
						class="grid gap-6"
						:style="`grid-template-columns: 200px repeat(${comparisonTemplates.length}, 1fr)`"
					>
						<!-- Feature Labels Column -->
						<div class="space-y-4">
							<div class="h-48"></div>
							<!-- Spacer for image -->
							<div
								v-for="feature in comparisonFeatures"
								:key="feature.id"
								class="h-12 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400"
							>
								{{ feature.name }}
							</div>
							<div class="h-16"></div>
							<!-- Spacer for actions -->
						</div>

						<!-- Template Columns -->
						<div
							v-for="template in comparisonTemplates"
							:key="template.id"
							class="space-y-4"
							:class="{
								'ring-2 ring-green-500 rounded-xl p-2':
									getBestTemplate()?.id === template.id,
							}"
						>
							<!-- Template Image -->
							<div class="h-48 rounded-xl overflow-hidden relative">
								<img
									:src="template.thumbnail"
									:alt="template.name"
									class="w-full h-full object-cover"
								/>
								<div
									v-if="getBestTemplate()?.id === template.id"
									class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium"
								>
									Best Match
								</div>
							</div>

							<!-- Feature Values -->
							<div
								v-for="feature in comparisonFeatures"
								:key="feature.id"
								class="h-12 flex items-center text-sm"
							>
								<span
									class="px-3 py-1 rounded-lg"
									:class="feature.id === 'rating' && Number(template.rating) >= 4.5
									? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
									: 'text-gray-700 dark:text-gray-300'"
								>
									{{ feature.getValue(template) }}
								</span>
							</div>

							<!-- Actions -->
							<div class="h-16 flex flex-col gap-2">
								<button
									class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
									@click="emit('select', template.id)"
								>
									Use This
								</button>
								<button
									class="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
									@click="emit('compare', comparisonTemplates.map(t => t.id))"
								>
									View Details
								</button>
							</div>
						</div>
					</div>

					<!-- Summary -->
					<div class="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							Comparison Summary
						</h3>
						<div class="grid grid-cols-3 gap-6">
							<div class="text-center">
								<div class="text-3xl font-bold text-blue-600">
									{{
										Math.max(...comparisonTemplates.map(t => t.rating))
										.toFixed(1)
									}}
								</div>
								<div class="text-sm text-gray-500">Highest Rating</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-green-600">
									{{
										Math.max(...comparisonTemplates.map(t => t.usageCount))
										.toLocaleString()
									}}
								</div>
								<div class="text-sm text-gray-500">Most Popular</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-purple-600">
									{{ comparisonTemplates.filter(t => !t.isPremium).length }}
								</div>
								<div class="text-sm text-gray-500">Free Options</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
