<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "select", template: Template): void;
	(e: "viewAll"): void;
}>();

const recentCount = ref(6);

const recentTemplates = computed(() => {
	return props.templates
		.slice()
		.sort((a, b) =>
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		)
		.slice(0, recentCount.value);
});

const mockRecent: Template[] = [
	{
		id: "recent-1",
		name: "Instagram Post - Summer Sale",
		description: "Promotional post for summer campaign",
		thumbnail: "https://picsum.photos/400/300?random=20",
		category: "social-media",
		tags: ["instagram", "sale"],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#ffffff",
		isPremium: false,
		rating: 4.5,
		usageCount: 12,
		createdAt: new Date("2024-01-20T10:00:00Z"),
		updatedAt: new Date("2024-01-25T14:30:00Z"),
	},
	{
		id: "recent-2",
		name: "Business Card - Modern",
		description: "Professional business card template",
		thumbnail: "https://picsum.photos/400/300?random=21",
		category: "business-card",
		tags: ["business", "professional"],
		elements: [],
		width: 1050,
		height: 600,
		backgroundColor: "#ffffff",
		isPremium: false,
		rating: 4.8,
		usageCount: 5,
		createdAt: new Date("2024-01-18T09:00:00Z"),
		updatedAt: new Date("2024-01-24T16:00:00Z"),
	},
	{
		id: "recent-3",
		name: "Flyer - Grand Opening",
		description: "Event flyer template",
		thumbnail: "https://picsum.photos/400/300?random=22",
		category: "flyer",
		tags: ["event", "opening"],
		elements: [],
		width: 850,
		height: 1100,
		backgroundColor: "#f8f8f8",
		isPremium: true,
		rating: 4.3,
		usageCount: 8,
		createdAt: new Date("2024-01-15T10:00:00Z"),
		updatedAt: new Date("2024-01-22T11:00:00Z"),
	},
];

const displayTemplates = computed(() => {
	return recentTemplates.value.length > 0 ? recentTemplates.value : mockRecent;
});

const formatTimeAgo = (date: Date) => {
	const now = new Date();
	const then = date;
	const diff = now.getTime() - then.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(hours / 24);

	if (hours < 1) return "Just now";
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return then.toLocaleDateString();
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
		<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<i class="i-mdi-history text-blue-500 text-xl" />
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Recent Templates
				</h3>
			</div>
			<button
				class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
				@click="$emit('viewAll')"
			>
				View History
			</button>
		</div>

		<div class="p-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="template in displayTemplates"
					:key="template.id"
					class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
					@click="$emit('select', template)"
				>
					<div class="aspect-video relative">
						<img
							:src="template.thumbnail"
							:alt="template.name"
							class="w-full h-full object-cover"
						/>
						<div class="absolute top-2 right-2">
							<span
								class="text-xs px-2 py-1 bg-black/60 text-white rounded-full backdrop-blur-sm"
							>
								{{ formatTimeAgo(template.updatedAt) }}
							</span>
						</div>
					</div>
					<div class="p-4">
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
