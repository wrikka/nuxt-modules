<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "select", template: Template): void;
	(e: "viewAll", industry: string): void;
}>();

const selectedIndustry = ref("all");

const industries = [
	{ id: "all", name: "All Industries", icon: "i-mdi-apps" },
	{ id: "real-estate", name: "Real Estate", icon: "i-mdi-home" },
	{
		id: "restaurant",
		name: "Restaurant & Food",
		icon: "i-mdi-silverware-fork-knife",
	},
	{ id: "healthcare", name: "Healthcare", icon: "i-mdi-hospital" },
	{ id: "technology", name: "Technology & SaaS", icon: "i-mdi-laptop" },
	{ id: "retail", name: "Retail & E-commerce", icon: "i-mdi-shopping" },
	{ id: "fitness", name: "Fitness & Gym", icon: "i-mdi-dumbbell" },
	{ id: "education", name: "Education", icon: "i-mdi-school" },
	{ id: "finance", name: "Finance", icon: "i-mdi-currency-usd" },
];

const industryTemplates: Record<string, Template[]> = {
	"real-estate": [
		{
			id: "re-1",
			name: "Property Listing",
			thumbnail: "https://picsum.photos/400/300?random=70",
			category: "other",
			tags: [],
			elements: [],
			width: 1080,
			height: 1080,
			backgroundColor: "#ffffff",
			isPremium: false,
			rating: 4.7,
			usageCount: 150,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "re-2",
			name: "Open House Flyer",
			thumbnail: "https://picsum.photos/400/300?random=71",
			category: "other",
			tags: [],
			elements: [],
			width: 850,
			height: 1100,
			backgroundColor: "#f5f5f5",
			isPremium: false,
			rating: 4.5,
			usageCount: 120,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	],
	"restaurant": [
		{
			id: "rest-1",
			name: "Menu Design",
			thumbnail: "https://picsum.photos/400/300?random=72",
			category: "other",
			tags: [],
			elements: [],
			width: 850,
			height: 1100,
			backgroundColor: "#fafafa",
			isPremium: false,
			rating: 4.8,
			usageCount: 200,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "rest-2",
			name: "Daily Specials",
			thumbnail: "https://picsum.photos/400/300?random=73",
			category: "other",
			tags: [],
			elements: [],
			width: 1080,
			height: 1080,
			backgroundColor: "#ffffff",
			isPremium: false,
			rating: 4.6,
			usageCount: 180,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	],
	"technology": [
		{
			id: "tech-1",
			name: "Product Launch",
			thumbnail: "https://picsum.photos/400/300?random=74",
			category: "other",
			tags: [],
			elements: [],
			width: 1080,
			height: 1080,
			backgroundColor: "#ffffff",
			isPremium: false,
			rating: 4.9,
			usageCount: 250,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "tech-2",
			name: "App Promo",
			thumbnail: "https://picsum.photos/400/300?random=75",
			category: "other",
			tags: [],
			elements: [],
			width: 1080,
			height: 1920,
			backgroundColor: "#1a1a1a",
			isPremium: false,
			rating: 4.7,
			usageCount: 190,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	],
};

const currentTemplates = computed(() => {
	if (selectedIndustry.value === "all") {
		return Object.values(industryTemplates).flat();
	}
	return industryTemplates[selectedIndustry.value] || [];
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
		<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-domain text-blue-500" />
				Industry-Specific Templates
			</h3>
		</div>

		<div class="p-6">
			<!-- Industry Filter -->
			<div class="flex flex-wrap gap-2 mb-6">
				<button
					v-for="industry in industries"
					:key="industry.id"
					class="flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all"
					:class="selectedIndustry === industry.id
					? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
					: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'"
					@click="selectedIndustry = industry.id"
				>
					<i :class="industry.icon" />
					{{ industry.name }}
				</button>
			</div>

			<!-- Templates Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="template in currentTemplates"
					:key="template.id"
					class="group bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
					@click="$emit('select', template)"
				>
					<div class="aspect-video relative">
						<img
							:src="template.thumbnail"
							:alt="template.name"
							class="w-full h-full object-cover"
						/>
					</div>
					<div class="p-4">
						<h4 class="font-medium text-gray-900 dark:text-white">
							{{ template.name }}
						</h4>
						<div class="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
							<span class="text-yellow-500">★</span>
							<span>{{ template.rating }}</span>
							<span>({{ template.usageCount }} uses)</span>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="currentTemplates.length === 0"
				class="text-center py-12 text-gray-500 dark:text-gray-400"
			>
				<i class="i-mdi-package-variant text-4xl mb-2" />
				<p>No templates available for this industry yet</p>
			</div>
		</div>
	</div>
</template>
