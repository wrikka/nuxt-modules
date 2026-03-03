<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
	userIndustry?: string;
}>();

const emit = defineEmits<{
	(e: "select", template: Template): void;
	(e: "dismiss", templateId: string): void;
}>();

const showAll = ref(false);

const mockRecommendations: Template[] = [
	{
		id: "rec-1",
		name: "Summer Sale Instagram Post",
		description: "Trending for retail businesses this week",
		thumbnail: "https://picsum.photos/400/300?random=60",
		category: "social-media",
		tags: ["sale", "summer"],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#ffffff",
		isPremium: false,
		rating: 4.8,
		usageCount: 120,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
		reason: "Trending in your industry",
	},
	{
		id: "rec-2",
		name: "Product Launch Announcement",
		description: "Based on your recent projects",
		thumbnail: "https://picsum.photos/400/300?random=61",
		category: "social-media",
		tags: ["product", "launch"],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#f5f5f5",
		isPremium: true,
		rating: 4.9,
		usageCount: 85,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
		reason: "Matches your brand style",
	},
	{
		id: "rec-3",
		name: "Customer Testimonial Card",
		description: "Popular for building trust",
		thumbnail: "https://picsum.photos/400/300?random=62",
		category: "social-media",
		tags: ["testimonial", "social-proof"],
		elements: [],
		width: 1080,
		height: 1350,
		backgroundColor: "#fafafa",
		isPremium: false,
		rating: 4.6,
		usageCount: 200,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
		reason: "Similar users loved this",
	},
	{
		id: "rec-4",
		name: "Weekly Newsletter Header",
		description: "Recommended for email campaigns",
		thumbnail: "https://picsum.photos/400/300?random=63",
		category: "presentation",
		tags: ["newsletter", "email"],
		elements: [],
		width: 1200,
		height: 600,
		backgroundColor: "#ffffff",
		isPremium: false,
		rating: 4.5,
		usageCount: 95,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
		reason: "Complements your recent work",
	},
];

const recommendations = computed(() => {
	return props.templates.length > 0 ? props.templates : mockRecommendations;
});

const displayedRecommendations = computed(() => {
	return showAll.value
		? recommendations.value
		: recommendations.value.slice(0, 3);
});

const getReasonIcon = (reason: string) => {
	if (reason.includes("Trending")) return "i-mdi-fire text-orange-500";
	if (reason.includes("brand")) return "i-mdi-palette text-purple-500";
	if (reason.includes("users")) return "i-mdi-account-group text-blue-500";
	return "i-mdi-lightbulb text-yellow-500";
};
</script>

<template>
	<div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-sm overflow-hidden">
		<div class="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-800/50">
			<div class="flex items-center gap-2">
				<i class="i-mdi-sparkles text-purple-500 text-xl" />
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Recommended for You
				</h3>
			</div>
			<button
				class="text-sm text-purple-600 dark:text-purple-400 hover:underline"
				@click="showAll = !showAll"
			>
				{{ showAll ? "Show Less" : "View All" }}
			</button>
		</div>

		<div class="p-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="template in displayedRecommendations"
					:key="template.id"
					class="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
					@click="$emit('select', template)"
				>
					<div class="aspect-video relative">
						<img
							:src="template.thumbnail"
							:alt="template.name"
							class="w-full h-full object-cover"
						/>
						<button
							class="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity"
							@click.stop="$emit('dismiss', template.id)"
						>
							<i class="i-mdi-close text-gray-500 dark:text-gray-400 text-sm" />
						</button>
					</div>
					<div class="p-4">
						<h4 class="font-medium text-gray-900 dark:text-white">
							{{ template.name }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
							{{ template.description }}
						</p>
						<div class="flex items-center gap-2 mt-2">
							<i
								:class="getReasonIcon(template.reason || '')"
								class="text-sm"
							/>
							<span class="text-xs text-purple-600 dark:text-purple-400">{{
								template.reason
							}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
