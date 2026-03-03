<script setup lang="ts">
import type { Template } from "#shared/types";

const emit = defineEmits<{
	(e: "close"): void;
	(e: "select", useCase: UseCase): void;
}>();

interface UseCase {
	id: string;
	title: string;
	description: string;
	category: string;
	industry: string;
	beforeImage: string;
	afterImage: string;
	templateUsed: string;
	results: string;
	timeSaved: string;
}

const selectedCategory = ref("all");
const selectedIndustry = ref("all");
const searchQuery = ref("");

const categories = [
	{ id: "all", name: "All Categories" },
	{ id: "marketing", name: "Marketing Campaigns" },
	{ id: "social", name: "Social Media" },
	{ id: "branding", name: "Branding" },
	{ id: "events", name: "Events" },
	{ id: "content", name: "Content Creation" },
];

const industries = [
	{ id: "all", name: "All Industries" },
	{ id: "restaurant", name: "Food & Restaurant" },
	{ id: "retail", name: "Retail & E-commerce" },
	{ id: "tech", name: "Technology" },
	{ id: "healthcare", name: "Healthcare" },
	{ id: "education", name: "Education" },
	{ id: "fitness", name: "Fitness & Wellness" },
	{ id: "real-estate", name: "Real Estate" },
];

const useCases: UseCase[] = [
	{
		id: "1",
		title: "Grand Opening Campaign",
		description:
			"A local coffee shop used our 'Cozy Cafe' template to create a consistent visual identity across all marketing materials.",
		category: "marketing",
		industry: "restaurant",
		beforeImage: "https://picsum.photos/400/300?random=1",
		afterImage: "https://picsum.photos/400/300?random=2",
		templateUsed: "Cozy Cafe Grand Opening",
		results: "3x increase in foot traffic during launch week",
		timeSaved: "15 hours",
	},
	{
		id: "2",
		title: "Product Launch Series",
		description:
			"Tech startup created a 12-post Instagram campaign announcing their new app features using consistent templates.",
		category: "social",
		industry: "tech",
		beforeImage: "https://picsum.photos/400/300?random=3",
		afterImage: "https://picsum.photos/400/300?random=4",
		templateUsed: "Tech Product Announcement",
		results: "50K impressions, 2K app downloads",
		timeSaved: "20 hours",
	},
	{
		id: "3",
		title: "Corporate Rebranding",
		description:
			"Healthcare clinic modernized their brand with professional templates for business cards, brochures, and signage.",
		category: "branding",
		industry: "healthcare",
		beforeImage: "https://picsum.photos/400/300?random=5",
		afterImage: "https://picsum.photos/400/300?random=6",
		templateUsed: "Medical Professional Suite",
		results: "40% increase in patient inquiries",
		timeSaved: "30 hours",
	},
	{
		id: "4",
		title: "Holiday Sale Blitz",
		description:
			"Online retailer created 50+ social posts for Black Friday using our sale template collection.",
		category: "marketing",
		industry: "retail",
		beforeImage: "https://picsum.photos/400/300?random=7",
		afterImage: "https://picsum.photos/400/300?random=8",
		templateUsed: "Flash Sale Collection",
		results: "$150K revenue in 3 days",
		timeSaved: "40 hours",
	},
	{
		id: "5",
		title: "Fitness Challenge",
		description:
			"Gym launched a 30-day transformation challenge with daily motivational posts using our fitness templates.",
		category: "content",
		industry: "fitness",
		beforeImage: "https://picsum.photos/400/300?random=9",
		afterImage: "https://picsum.photos/400/300?random=10",
		templateUsed: "Fitness Motivation Series",
		results: "200 new members enrolled",
		timeSaved: "25 hours",
	},
	{
		id: "6",
		title: "Property Showcase",
		description:
			"Real estate agent created stunning property listings with virtual tour announcements.",
		category: "marketing",
		industry: "real-estate",
		beforeImage: "https://picsum.photos/400/300?random=11",
		afterImage: "https://picsum.photos/400/300?random=12",
		templateUsed: "Luxury Property Listing",
		results: "Sold 3 properties in first month",
		timeSaved: "12 hours",
	},
];

const filteredUseCases = computed(() => {
	return useCases.filter(uc => {
		const matchesCategory = selectedCategory.value === "all"
			|| uc.category === selectedCategory.value;
		const matchesIndustry = selectedIndustry.value === "all"
			|| uc.industry === selectedIndustry.value;
		const matchesSearch =
			uc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| uc.description.toLowerCase().includes(searchQuery.value.toLowerCase());
		return matchesCategory && matchesIndustry && matchesSearch;
	});
});

const stats = computed(() => ({
	totalCases: useCases.length,
	totalTimeSaved: useCases.reduce((acc, uc) => acc + parseInt(uc.timeSaved), 0),
	avgResults: "2.5x engagement",
}));
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
					<div>
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							Template Use Cases
						</h2>
						<p class="text-sm text-gray-500 mt-1">
							See how businesses are using our templates
						</p>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Stats Banner -->
				<div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
					<div class="flex items-center justify-center gap-12 text-white">
						<div class="text-center">
							<div class="text-3xl font-bold">{{ stats.totalCases }}+</div>
							<div class="text-sm opacity-80">Success Stories</div>
						</div>
						<div class="w-px h-12 bg-white/30" />
						<div class="text-center">
							<div class="text-3xl font-bold">{{ stats.totalTimeSaved }}+</div>
							<div class="text-sm opacity-80">Hours Saved</div>
						</div>
						<div class="w-px h-12 bg-white/30" />
						<div class="text-center">
							<div class="text-3xl font-bold">{{ stats.avgResults }}</div>
							<div class="text-sm opacity-80">Average Impact</div>
						</div>
					</div>
				</div>

				<!-- Filters -->
				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search use cases..."
						class="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm flex-1 min-w-[200px]"
					/>
					<select
						v-model="selectedCategory"
						class="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
					>
						<option v-for="cat in categories" :key="cat.id" :value="cat.id">
							{{ cat.name }}
						</option>
					</select>
					<select
						v-model="selectedIndustry"
						class="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
					>
						<option v-for="ind in industries" :key="ind.id" :value="ind.id">
							{{ ind.name }}
						</option>
					</select>
				</div>

				<!-- Use Cases Grid -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div
							v-for="useCase in filteredUseCases"
							:key="useCase.id"
							class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
						>
							<!-- Before/After -->
							<div class="relative">
								<div class="grid grid-cols-2">
									<div class="relative">
										<img
											:src="useCase.beforeImage"
											class="w-full h-48 object-cover"
										/>
										<span
											class="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded"
										>Before</span>
									</div>
									<div class="relative">
										<img
											:src="useCase.afterImage"
											class="w-full h-48 object-cover"
										/>
										<span
											class="absolute bottom-2 right-2 px-2 py-1 bg-green-600 text-white text-xs rounded"
										>After</span>
									</div>
								</div>
								<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
									<i class="i-mdi-arrow-right text-gray-600" />
								</div>
							</div>

							<!-- Content -->
							<div class="p-6">
								<div class="flex items-center gap-2 mb-2">
									<span
										class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
									>
										{{ categories.find(c => c.id === useCase.category)?.name }}
									</span>
									<span
										class="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full"
									>
										{{ industries.find(i => i.id === useCase.industry)?.name }}
									</span>
								</div>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									{{ useCase.title }}
								</h3>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
									{{ useCase.description }}
								</p>

								<!-- Results -->
								<div class="grid grid-cols-2 gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
									<div>
										<div class="text-xs text-gray-500 uppercase">Results</div>
										<div class="text-sm font-medium text-green-600">
											{{ useCase.results }}
										</div>
									</div>
									<div>
										<div class="text-xs text-gray-500 uppercase">
											Time Saved
										</div>
										<div class="text-sm font-medium text-blue-600">
											{{ useCase.timeSaved }}
										</div>
									</div>
								</div>

								<!-- Template Used -->
								<div class="flex items-center justify-between">
									<div class="text-sm text-gray-500">
										Template: <span
											class="text-gray-700 dark:text-gray-300 font-medium"
										>{{ useCase.templateUsed }}</span>
									</div>
									<button
										class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
										@click="emit('select', useCase)"
									>
										Try Template
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Empty State -->
					<div v-if="filteredUseCases.length === 0" class="text-center py-12">
						<i class="i-mdi-lightbulb-outline text-4xl text-gray-400 mb-4" />
						<p class="text-gray-500">No use cases match your filters</p>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
