<script setup lang="ts">
import type { Template, TemplateCategory } from "#shared/types";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "search", query: string, filters: SearchFilters): void;
	(e: "close"): void;
}>();

interface SearchFilters {
	categories: TemplateCategory[];
	sizes: string[];
	styles: string[];
	colors: string[];
	isPremium: boolean | null;
	minRating: number;
	dateRange: "all" | "today" | "week" | "month";
	sortBy: "relevance" | "popular" | "newest" | "rating";
}

const searchQuery = ref("");
const isAISearch = ref(false);
const showFilters = ref(false);
const recentSearches = ref<string[]>([
	"social media",
	"business card",
	"minimal",
]);

const filters = reactive<SearchFilters>({
	categories: [],
	sizes: [],
	styles: [],
	colors: [],
	isPremium: null,
	minRating: 0,
	dateRange: "all",
	sortBy: "relevance",
});

const sizeOptions = [
	{
		value: "instagram-post",
		label: "Instagram Post (1080×1080)",
		icon: "i-mdi-instagram",
	},
	{
		value: "instagram-story",
		label: "Instagram Story (1080×1920)",
		icon: "i-mdi-instagram",
	},
	{
		value: "youtube-thumbnail",
		label: "YouTube Thumbnail (1280×720)",
		icon: "i-mdi-youtube",
	},
	{
		value: "facebook-post",
		label: "Facebook Post (1200×630)",
		icon: "i-mdi-facebook",
	},
	{
		value: "twitter-post",
		label: "Twitter Post (1200×675)",
		icon: "i-mdi-twitter",
	},
	{
		value: "linkedin-post",
		label: "LinkedIn Post (1200×627)",
		icon: "i-mdi-linkedin",
	},
	{ value: "a4", label: "A4 Print (2480×3508)", icon: "i-mdi-file-document" },
	{ value: "a5", label: "A5 Print (1748×2480)", icon: "i-mdi-file-document" },
	{ value: "banner", label: "Web Banner (728×90)", icon: "i-mdi-web" },
];

const styleOptions = [
	"Minimal",
	"Modern",
	"Vintage",
	"Corporate",
	"Playful",
	"Elegant",
	"Bold",
	"Clean",
];

const colorOptions = [
	{ value: "red", label: "Red", class: "bg-red-500" },
	{ value: "blue", label: "Blue", class: "bg-blue-500" },
	{ value: "green", label: "Green", class: "bg-green-500" },
	{ value: "yellow", label: "Yellow", class: "bg-yellow-500" },
	{ value: "purple", label: "Purple", class: "bg-purple-500" },
	{ value: "pink", label: "Pink", class: "bg-pink-500" },
	{ value: "orange", label: "Orange", class: "bg-orange-500" },
	{ value: "monochrome", label: "Monochrome", class: "bg-gray-800" },
	{
		value: "rainbow",
		label: "Rainbow",
		class: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500",
	},
];

const aiSuggestions = ref<string[]>([
	"A minimalist Instagram post for a coffee shop",
	"Professional business card for a tech startup",
	"Vintage poster for a music festival",
	"Modern resume for a designer",
]);

const toggleFilter = <K extends keyof SearchFilters>(
	key: K,
	value: SearchFilters[K] extends Array<infer U> ? U : never,
) => {
	const arr = filters[key] as unknown as string[];
	const index = arr.indexOf(value as string);
	if (index > -1) {
		arr.splice(index, 1);
	} else {
		arr.push(value as string);
	}
};

const applySearch = () => {
	emit("search", searchQuery.value, { ...filters });
};

const clearFilters = () => {
	filters.categories = [];
	filters.sizes = [];
	filters.styles = [];
	filters.colors = [];
	filters.isPremium = null;
	filters.minRating = 0;
	filters.dateRange = "all";
	filters.sortBy = "relevance";
};

const activeFiltersCount = computed(() => {
	return filters.categories.length + filters.sizes.length
		+ filters.styles.length + filters.colors.length
		+ (filters.isPremium !== null ? 1 : 0) + (filters.minRating > 0 ? 1 : 0);
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
		<!-- Search Bar -->
		<div class="relative">
			<div class="flex items-center gap-3">
				<div class="relative flex-1">
					<i
						class="i-mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search templates... Try 'minimal Instagram post'"
						class="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
						@keyup.enter="applySearch"
					/>
					<button
						v-if="searchQuery"
						class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
						@click="searchQuery = ''"
					>
						<i class="i-mdi-close text-gray-500" />
					</button>
				</div>

				<!-- AI Search Toggle -->
				<button
					class="flex items-center gap-2 px-4 py-3 rounded-xl transition-colors"
					:class="isAISearch
					? 'bg-purple-600 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="isAISearch = !isAISearch"
				>
					<i class="i-mdi-robot" />
					<span class="font-medium">AI Search</span>
				</button>

				<!-- Filter Toggle -->
				<button
					class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					@click="showFilters = !showFilters"
				>
					<i class="i-mdi-filter" />
					<span class="font-medium">Filters</span>
					<span
						v-if="activeFiltersCount > 0"
						class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
					>
						{{ activeFiltersCount }}
					</span>
				</button>
			</div>

			<!-- AI Suggestions -->
			<div
				v-if="isAISearch && !searchQuery"
				class="mt-3 flex flex-wrap gap-2"
			>
				<span class="text-sm text-gray-500 dark:text-gray-400">Try:</span>
				<button
					v-for="suggestion in aiSuggestions"
					:key="suggestion"
					class="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
					@click="searchQuery = suggestion"
				>
					"{{ suggestion }}"
				</button>
			</div>

			<!-- Recent Searches -->
			<div
				v-if="!isAISearch && recentSearches.length && !searchQuery"
				class="mt-3 flex items-center gap-2"
			>
				<span class="text-sm text-gray-500 dark:text-gray-400">Recent:</span>
				<button
					v-for="search in recentSearches"
					:key="search"
					class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					@click="searchQuery = search"
				>
					{{ search }}
				</button>
			</div>
		</div>

		<!-- Filters Panel -->
		<Transition name="slide-down">
			<div
				v-if="showFilters"
				class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<!-- Platform/Sizes -->
					<div>
						<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
							Platform/Size
						</h4>
						<div class="space-y-1 max-h-48 overflow-y-auto">
							<label
								v-for="size in sizeOptions"
								:key="size.value"
								class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
							>
								<input
									type="checkbox"
									:checked="filters.sizes.includes(size.value)"
									class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									@change="toggleFilter('sizes', size.value)"
								/>
								<i :class="size.icon" class="text-gray-500" />
								<span class="text-sm text-gray-700 dark:text-gray-300">{{
									size.label
								}}</span>
							</label>
						</div>
					</div>

					<!-- Styles -->
					<div>
						<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
							Style
						</h4>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="style in styleOptions"
								:key="style"
								class="px-3 py-1 text-sm rounded-full border transition-colors"
								:class="filters.styles.includes(style)
								? 'bg-blue-500 text-white border-blue-500'
								: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'"
								@click="toggleFilter('styles', style)"
							>
								{{ style }}
							</button>
						</div>
					</div>

					<!-- Colors -->
					<div>
						<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
							Color Scheme
						</h4>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="color in colorOptions"
								:key="color.value"
								class="w-8 h-8 rounded-full border-2 transition-all"
								:class="[
									color.class,
									filters.colors.includes(color.value)
										? 'border-white ring-2 ring-blue-500 scale-110'
										: 'border-transparent',
								]"
								:title="color.label"
								@click="toggleFilter('colors', color.value)"
							/>
						</div>
					</div>

					<!-- Premium & Rating -->
					<div class="space-y-4">
						<div>
							<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
								Type
							</h4>
							<div class="flex gap-2">
								<button
									class="px-3 py-1 text-sm rounded-full border transition-colors"
									:class="filters.isPremium === false
									? 'bg-green-500 text-white border-green-500'
									: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'"
									@click="filters.isPremium = filters.isPremium === false
									? null
									: false"
								>
									Free
								</button>
								<button
									class="px-3 py-1 text-sm rounded-full border transition-colors"
									:class="filters.isPremium === true
									? 'bg-yellow-500 text-white border-yellow-500'
									: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'"
									@click="filters.isPremium = filters.isPremium === true ? null : true"
								>
									Premium
								</button>
							</div>
						</div>

						<div>
							<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
								Minimum Rating
							</h4>
							<div class="flex gap-1">
								<button
									v-for="star in 5"
									:key="star"
									class="text-xl transition-colors"
									:class="star <= filters.minRating
									? 'text-yellow-500'
									: 'text-gray-300 dark:text-gray-600'"
									@click="filters.minRating = star === filters.minRating ? 0 : star"
								>
									<i
										:class="star <= filters.minRating
										? 'i-mdi-star'
										: 'i-mdi-star-outline'"
									/>
								</button>
							</div>
						</div>

						<div>
							<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
								Sort By
							</h4>
							<select
								v-model="filters.sortBy"
								class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
							>
								<option value="relevance">Relevance</option>
								<option value="popular">Most Popular</option>
								<option value="newest">Newest First</option>
								<option value="rating">Highest Rated</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Filter Actions -->
				<div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
					<button
						class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						@click="clearFilters"
					>
						Clear all filters
					</button>
					<button
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
						@click="applySearch"
					>
						Apply Filters
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
