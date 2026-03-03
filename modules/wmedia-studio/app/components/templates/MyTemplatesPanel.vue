<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "select", template: Template): void;
	(e: "delete", templateId: string): void;
	(e: "edit", template: Template): void;
	(e: "share", template: Template): void;
}>();

const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref<"newest" | "oldest" | "name" | "usage">("newest");

const myTemplates = computed(() => {
	return props.templates.filter(t => t.isCustom);
});

const sortedTemplates = computed(() => {
	const sorted = [...myTemplates.value];
	switch (sortBy.value) {
		case "newest":
			return sorted.sort((a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		case "oldest":
			return sorted.sort((a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
		case "name":
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case "usage":
			return sorted.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
		default:
			return sorted;
	}
});

const mockTemplates: Template[] = [
	{
		id: "custom-1",
		name: "My Brand Template",
		description: "Custom template for brand posts",
		thumbnail: "https://picsum.photos/400/300?random=1",
		category: "social-media",
		tags: ["branding", "social"],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#ffffff",
		isPremium: false,
		isCustom: true,
		rating: 0,
		usageCount: 15,
		createdAt: new Date("2024-01-15T10:00:00Z"),
		updatedAt: new Date("2024-01-20T10:00:00Z"),
	},
	{
		id: "custom-2",
		name: "Weekly Newsletter",
		description: "Email newsletter template",
		thumbnail: "https://picsum.photos/400/300?random=2",
		category: "presentation",
		tags: ["email", "newsletter"],
		elements: [],
		width: 600,
		height: 800,
		backgroundColor: "#f8f9fa",
		isPremium: false,
		isCustom: true,
		rating: 0,
		usageCount: 8,
		createdAt: new Date("2024-01-10T10:00:00Z"),
		updatedAt: new Date("2024-01-18T10:00:00Z"),
	},
];

const displayTemplates = computed(() => {
	return sortedTemplates.value.length > 0
		? sortedTemplates.value
		: mockTemplates;
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
		<!-- Header -->
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					My Templates
				</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{{ displayTemplates.length }} custom templates
				</p>
			</div>
			<div class="flex items-center gap-3">
				<select
					v-model="sortBy"
					class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
				>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="name">Name A-Z</option>
					<option value="usage">Most Used</option>
				</select>
				<div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
					<button
						class="p-1.5 rounded"
						:class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''"
						@click="viewMode = 'grid'"
					>
						<i class="i-mdi-grid text-gray-600 dark:text-gray-400" />
					</button>
					<button
						class="p-1.5 rounded"
						:class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''"
						@click="viewMode = 'list'"
					>
						<i class="i-mdi-view-list text-gray-600 dark:text-gray-400" />
					</button>
				</div>
			</div>
		</div>

		<!-- Templates Grid -->
		<div
			v-if="viewMode === 'grid'"
			class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<div
				v-for="template in displayTemplates"
				:key="template.id"
				class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden hover:shadow-md transition-all"
			>
				<div class="aspect-video relative">
					<img
						:src="template.thumbnail"
						:alt="template.name"
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
						<div class="flex gap-2">
							<button
								class="p-2 bg-white rounded-full hover:bg-gray-100"
								title="Edit"
								@click="$emit('edit', template)"
							>
								<i class="i-mdi-pencil text-gray-700" />
							</button>
							<button
								class="p-2 bg-white rounded-full hover:bg-gray-100"
								title="Share"
								@click="$emit('share', template)"
							>
								<i class="i-mdi-share text-gray-700" />
							</button>
							<button
								class="p-2 bg-white rounded-full hover:bg-gray-100"
								title="Delete"
								@click="$emit('delete', template.id)"
							>
								<i class="i-mdi-delete text-red-500" />
							</button>
						</div>
					</div>
				</div>
				<div class="p-4">
					<h4 class="font-medium text-gray-900 dark:text-white">
						{{ template.name }}
					</h4>
					<p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
						{{ template.description }}
					</p>
					<div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
						<span>{{ template.usageCount }} uses</span>
						<span>{{ new Date(template.updatedAt).toLocaleDateString() }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Templates List -->
		<div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
			<div
				v-for="template in displayTemplates"
				:key="template.id"
				class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
			>
				<img
					:src="template.thumbnail"
					:alt="template.name"
					class="w-16 h-12 object-cover rounded"
				/>
				<div class="flex-1 min-w-0">
					<h4 class="font-medium text-gray-900 dark:text-white">
						{{ template.name }}
					</h4>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{{ template.description }}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="$emit('edit', template)"
					>
						<i class="i-mdi-pencil text-gray-600 dark:text-gray-400" />
					</button>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="$emit('share', template)"
					>
						<i class="i-mdi-share text-gray-600 dark:text-gray-400" />
					</button>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="$emit('delete', template.id)"
					>
						<i class="i-mdi-delete text-red-500" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
