<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
	modelValue: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const categories = [
	{ id: "", name: "All Templates", icon: "i-mdi-apps", count: 0 },
	{
		id: "social-media",
		name: "Social Media",
		icon: "i-mdi-share-variant",
		count: 0,
	},
	{
		id: "presentation",
		name: "Presentation",
		icon: "i-mdi-presentation",
		count: 0,
	},
	{ id: "poster", name: "Poster", icon: "i-mdi-image-frame", count: 0 },
	{ id: "flyer", name: "Flyer", icon: "i-mdi-file-document", count: 0 },
	{
		id: "business-card",
		name: "Business Card",
		icon: "i-mdi-card-account-details",
		count: 0,
	},
	{ id: "resume", name: "Resume", icon: "i-mdi-file-account", count: 0 },
	{ id: "infographic", name: "Infographic", icon: "i-mdi-chart-bar", count: 0 },
	{ id: "menu", name: "Menu", icon: "i-mdi-menu-book", count: 0 },
	{
		id: "invitation",
		name: "Invitation",
		icon: "i-mdi-email-outline",
		count: 0,
	},
	{ id: "banner", name: "Banner", icon: "i-mdi-sign-real-estate", count: 0 },
	{ id: "logo", name: "Logo", icon: "i-mdi-shape", count: 0 },
];

const categoryCounts = computed(() => {
	const counts: Record<string, number> = { "": props.templates.length };
	for (const template of props.templates) {
		counts[template.category] = (counts[template.category] || 0) + 1;
	}
	return counts;
});

const selectedCategory = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});
</script>

<template>
	<div class="w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
			Categories
		</h3>
		<nav class="space-y-1">
			<button
				v-for="category in categories"
				:key="category.id"
				class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors"
				:class="[
					selectedCategory === category.id
						? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
						: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
				]"
				@click="selectedCategory = category.id"
			>
				<div class="flex items-center gap-3">
					<i :class="[category.icon, 'text-lg']" />
					<span>{{ category.name }}</span>
				</div>
				<span
					class="text-xs px-2 py-0.5 rounded-full"
					:class="[
						selectedCategory === category.id
							? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
							: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
					]"
				>
					{{ categoryCounts[category.id] || 0 }}
				</span>
			</button>
		</nav>
	</div>
</template>
