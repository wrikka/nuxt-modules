<script setup lang="ts">
import type { Template } from "#shared/types";
import { ref } from "vue";

const emit = defineEmits<{
	(e: "select", collectionId: string): void;
	(e: "viewAll", category: string): void;
}>();

interface TemplateCollection {
	id: string;
	name: string;
	description: string;
	category: string;
	thumbnail: string;
	templateCount: number;
	isFeatured: boolean;
	color: string;
}

const collections = ref<TemplateCollection[]>([
	{
		id: "holiday-2024",
		name: "Holiday Season 2024",
		description:
			"Festive templates for Christmas, New Year, and holiday campaigns",
		category: "holiday",
		thumbnail: "https://picsum.photos/400/300?random=10",
		templateCount: 24,
		isFeatured: true,
		color: "from-red-500 to-green-500",
	},
	{
		id: "marketing-q1",
		name: "Q1 Marketing Campaign",
		description: "Kick off the year with professional marketing materials",
		category: "marketing",
		thumbnail: "https://picsum.photos/400/300?random=11",
		templateCount: 18,
		isFeatured: true,
		color: "from-blue-500 to-purple-500",
	},
	{
		id: "product-launch",
		name: "Product Launch Kit",
		description: "Everything you need for a successful product launch",
		category: "business",
		thumbnail: "https://picsum.photos/400/300?random=12",
		templateCount: 12,
		isFeatured: false,
		color: "from-orange-500 to-pink-500",
	},
	{
		id: "event-promotion",
		name: "Event Promotion Bundle",
		description: "Posters, flyers, and social media for your next event",
		category: "event",
		thumbnail: "https://picsum.photos/400/300?random=13",
		templateCount: 15,
		isFeatured: false,
		color: "from-teal-500 to-cyan-500",
	},
	{
		id: "social-media-kit",
		name: "Social Media Starter Kit",
		description: "Complete social media presence templates",
		category: "social",
		thumbnail: "https://picsum.photos/400/300?random=14",
		templateCount: 30,
		isFeatured: true,
		color: "from-indigo-500 to-blue-500",
	},
	{
		id: "brand-refresh",
		name: "Brand Refresh 2024",
		description: "Modernize your brand with fresh templates",
		category: "branding",
		thumbnail: "https://picsum.photos/400/300?random=15",
		templateCount: 20,
		isFeatured: false,
		color: "from-violet-500 to-fuchsia-500",
	},
]);

const featuredCollections = collections.value.filter(c => c.isFeatured);
const regularCollections = collections.value.filter(c => !c.isFeatured);
</script>

<template>
	<div class="space-y-8">
		<!-- Featured Collections -->
		<div v-if="featuredCollections.length > 0">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
					<i class="i-mdi-star text-yellow-500" />
					Featured Collections
				</h3>
				<button
					class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					@click="$emit('viewAll', 'featured')"
				>
					View All
				</button>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="collection in featuredCollections"
					:key="collection.id"
					class="group relative overflow-hidden rounded-xl cursor-pointer"
					@click="$emit('select', collection.id)"
				>
					<div :class="`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-90`" />
					<img
						:src="collection.thumbnail"
						:alt="collection.name"
						class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-500"
					/>
					<div class="relative p-6 min-h-[180px] flex flex-col justify-end">
						<div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
							<h4 class="font-bold text-gray-900 dark:text-white">
								{{ collection.name }}
							</h4>
							<p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
								{{ collection.description }}
							</p>
							<div class="flex items-center justify-between mt-3">
								<span
									class="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300"
								>
									{{ collection.templateCount }} templates
								</span>
								<i
									class="i-mdi-arrow-right text-gray-400 group-hover:text-blue-500 transition-colors"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- All Collections -->
		<div>
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					All Collections
				</h3>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<div
					v-for="collection in regularCollections"
					:key="collection.id"
					class="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
					@click="$emit('select', collection.id)"
				>
					<div class="aspect-video relative overflow-hidden">
						<img
							:src="collection.thumbnail"
							:alt="collection.name"
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						<span
							class="absolute bottom-2 left-2 text-xs font-medium px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-300"
						>
							{{ collection.templateCount }} templates
						</span>
					</div>
					<div class="p-4">
						<h4 class="font-medium text-gray-900 dark:text-white">
							{{ collection.name }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
							{{ collection.description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
