<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed } from "vue";

const props = defineProps<{
	templates: Template[];
	favorites: string[];
}>();

const emit = defineEmits<{
	(e: "toggle", templateId: string): void;
	(e: "select", template: Template): void;
}>();

const favoriteTemplates = computed(() => {
	return props.templates.filter(t => props.favorites.includes(t.id));
});

const mockFavorites: Template[] = [
	{
		id: "fav-1",
		name: "Premium Instagram Story",
		description: "Stunning story template",
		thumbnail: "https://picsum.photos/400/300?random=30",
		category: "social-media",
		tags: ["instagram", "story"],
		elements: [],
		width: 1080,
		height: 1920,
		backgroundColor: "#ffffff",
		isPremium: true,
		isCustom: false,
		rating: 4.9,
		usageCount: 250,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
	},
];

const displayTemplates = computed(() => {
	return favoriteTemplates.value.length > 0
		? favoriteTemplates.value
		: mockFavorites;
});

const isFavorite = (id: string) => props.favorites.includes(id);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<i class="i-mdi-heart text-red-500 text-xl" />
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Favorites
					<span class="text-sm font-normal text-gray-500 dark:text-gray-400"
					>({{ displayTemplates.length }})</span>
				</h3>
			</div>
		</div>

		<div class="p-6">
			<div
				v-if="displayTemplates.length === 0"
				class="text-center py-8 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-heart-outline text-4xl mb-2" />
				<p>No favorites yet</p>
				<p class="text-sm">Star templates to save them here</p>
			</div>

			<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="template in displayTemplates"
					:key="template.id"
					class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
				>
					<div class="aspect-video relative">
						<img
							:src="template.thumbnail"
							:alt="template.name"
							class="w-full h-full object-cover"
							@click="$emit('select', template)"
						/>
						<button
							class="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-sm hover:scale-110 transition-transform"
							@click.stop="$emit('toggle', template.id)"
						>
							<i
								:class="isFavorite(template.id)
								? 'i-mdi-heart text-red-500'
								: 'i-mdi-heart-outline text-gray-400'"
							/>
						</button>
					</div>
					<div class="p-4" @click="$emit('select', template)">
						<h4 class="font-medium text-gray-900 dark:text-white line-clamp-1">
							{{ template.name }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
							{{ template.description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
