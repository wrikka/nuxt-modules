<script setup lang="ts">
import type { TemplateCategory } from "#shared/types";

const emit = defineEmits<{
	(e: "select", size: SizePreset): void;
	(e: "custom", width: number, height: number): void;
}>();

interface SizePreset {
	id: string;
	name: string;
	category: TemplateCategory;
	width: number;
	height: number;
	icon: string;
	platform: string;
	popular?: boolean;
}

const selectedCategory = ref<string>("all");
const customWidth = ref(1080);
const customHeight = ref(1080);
const showCustom = ref(false);

const categories = [
	{ id: "all", name: "All Platforms", icon: "i-mdi-view-grid" },
	{ id: "social", name: "Social Media", icon: "i-mdi-share-variant" },
	{ id: "print", name: "Print", icon: "i-mdi-printer" },
	{ id: "web", name: "Web & Digital", icon: "i-mdi-web" },
	{ id: "video", name: "Video", icon: "i-mdi-video" },
	{ id: "mobile", name: "Mobile Apps", icon: "i-mdi-cellphone" },
];

const sizePresets: SizePreset[] = [
	// Social Media
	{
		id: "ig-post",
		name: "Instagram Post",
		category: "social-media",
		width: 1080,
		height: 1080,
		icon: "i-mdi-instagram",
		platform: "Instagram",
		popular: true,
	},
	{
		id: "ig-story",
		name: "Instagram Story",
		category: "social-media",
		width: 1080,
		height: 1920,
		icon: "i-mdi-instagram",
		platform: "Instagram",
		popular: true,
	},
	{
		id: "ig-reel",
		name: "Instagram Reel",
		category: "social-media",
		width: 1080,
		height: 1920,
		icon: "i-mdi-instagram",
		platform: "Instagram",
	},
	{
		id: "fb-post",
		name: "Facebook Post",
		category: "social-media",
		width: 1200,
		height: 630,
		icon: "i-mdi-facebook",
		platform: "Facebook",
	},
	{
		id: "fb-cover",
		name: "Facebook Cover",
		category: "social-media",
		width: 820,
		height: 312,
		icon: "i-mdi-facebook",
		platform: "Facebook",
	},
	{
		id: "tw-post",
		name: "Twitter Post",
		category: "social-media",
		width: 1200,
		height: 675,
		icon: "i-mdi-twitter",
		platform: "Twitter",
	},
	{
		id: "tw-header",
		name: "Twitter Header",
		category: "social-media",
		width: 1500,
		height: 500,
		icon: "i-mdi-twitter",
		platform: "Twitter",
	},
	{
		id: "li-post",
		name: "LinkedIn Post",
		category: "social-media",
		width: 1200,
		height: 627,
		icon: "i-mdi-linkedin",
		platform: "LinkedIn",
	},
	{
		id: "li-banner",
		name: "LinkedIn Banner",
		category: "social-media",
		width: 1584,
		height: 396,
		icon: "i-mdi-linkedin",
		platform: "LinkedIn",
	},
	{
		id: "yt-thumbnail",
		name: "YouTube Thumbnail",
		category: "social-media",
		width: 1280,
		height: 720,
		icon: "i-mdi-youtube",
		platform: "YouTube",
		popular: true,
	},
	{
		id: "yt-banner",
		name: "YouTube Banner",
		category: "social-media",
		width: 2560,
		height: 1440,
		icon: "i-mdi-youtube",
		platform: "YouTube",
	},
	{
		id: "pin-pin",
		name: "Pinterest Pin",
		category: "social-media",
		width: 1000,
		height: 1500,
		icon: "i-mdi-pinterest",
		platform: "Pinterest",
	},
	{
		id: "tk-video",
		name: "TikTok Video",
		category: "social-media",
		width: 1080,
		height: 1920,
		icon: "i-mdi-music-note",
		platform: "TikTok",
	},

	// Print
	{
		id: "a4",
		name: "A4 Paper",
		category: "poster",
		width: 2480,
		height: 3508,
		icon: "i-mdi-file-document",
		platform: "Print",
		popular: true,
	},
	{
		id: "a5",
		name: "A5 Paper",
		category: "poster",
		width: 1748,
		height: 2480,
		icon: "i-mdi-file-document",
		platform: "Print",
	},
	{
		id: "letter",
		name: "US Letter",
		category: "poster",
		width: 2550,
		height: 3300,
		icon: "i-mdi-file-document",
		platform: "Print",
	},
	{
		id: "business-card",
		name: "Business Card",
		category: "business-card",
		width: 1050,
		height: 600,
		icon: "i-mdi-card-account-details",
		platform: "Print",
		popular: true,
	},
	{
		id: "postcard",
		name: "Postcard",
		category: "flyer",
		width: 1800,
		height: 1200,
		icon: "i-mdi-postage-stamp",
		platform: "Print",
	},
	{
		id: "flyer",
		name: "Flyer (A5)",
		category: "flyer",
		width: 1748,
		height: 2480,
		icon: "i-mdi-file-document",
		platform: "Print",
	},

	// Web
	{
		id: "web-banner",
		name: "Web Banner",
		category: "banner",
		width: 728,
		height: 90,
		icon: "i-mdi-web",
		platform: "Web",
	},
	{
		id: "web-leaderboard",
		name: "Leaderboard",
		category: "banner",
		width: 970,
		height: 90,
		icon: "i-mdi-web",
		platform: "Web",
	},
	{
		id: "web-skyscraper",
		name: "Skyscraper",
		category: "banner",
		width: 160,
		height: 600,
		icon: "i-mdi-web",
		platform: "Web",
	},
	{
		id: "web-square",
		name: "Large Square",
		category: "banner",
		width: 336,
		height: 280,
		icon: "i-mdi-web",
		platform: "Web",
	},
	{
		id: "email-header",
		name: "Email Header",
		category: "banner",
		width: 600,
		height: 200,
		icon: "i-mdi-email",
		platform: "Email",
	},

	// Video
	{
		id: "video-fhd",
		name: "Full HD (1080p)",
		category: "social-media",
		width: 1920,
		height: 1080,
		icon: "i-mdi-video",
		platform: "Video",
		popular: true,
	},
	{
		id: "video-4k",
		name: "4K UHD",
		category: "social-media",
		width: 3840,
		height: 2160,
		icon: "i-mdi-video",
		platform: "Video",
	},
	{
		id: "video-vertical",
		name: "Vertical Video",
		category: "social-media",
		width: 1080,
		height: 1920,
		icon: "i-mdi-video",
		platform: "Video",
	},
	{
		id: "video-square",
		name: "Square Video",
		category: "social-media",
		width: 1080,
		height: 1080,
		icon: "i-mdi-video",
		platform: "Video",
	},
];

const filteredPresets = computed(() => {
	if (selectedCategory.value === "all") return sizePresets;
	if (selectedCategory.value === "social") {
		return sizePresets.filter(p => p.category === "social-media");
	}
	if (selectedCategory.value === "print") {
		return sizePresets.filter(p =>
			["poster", "flyer", "business-card"].includes(p.category)
		);
	}
	if (selectedCategory.value === "web") {
		return sizePresets.filter(p => p.category === "banner");
	}
	if (selectedCategory.value === "video") {
		return sizePresets.filter(p => p.platform === "Video");
	}
	if (selectedCategory.value === "mobile") {
		return sizePresets.filter(p => p.height > p.width);
	}
	return sizePresets;
});

const popularPresets = computed(() => sizePresets.filter(p => p.popular));

const selectPreset = (preset: SizePreset) => {
	emit("select", preset);
};

const createCustom = () => {
	emit("custom", customWidth.value, customHeight.value);
};

const getAspectRatio = (width: number, height: number) => {
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
	const divisor = gcd(width, height);
	return `${width / divisor}:${height / divisor}`;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
				Choose a Size
			</h2>
			<button
				class="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
				@click="showCustom = !showCustom"
			>
				<i class="i-mdi-ruler-square mr-1" />
				Custom Size
			</button>
		</div>

		<!-- Category Tabs -->
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				v-for="cat in categories"
				:key="cat.id"
				class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
				:class="selectedCategory === cat.id
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="selectedCategory = cat.id"
			>
				<i :class="cat.icon" />
				{{ cat.name }}
			</button>
		</div>

		<!-- Custom Size Form -->
		<Transition name="slide-down">
			<div
				v-if="showCustom"
				class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
			>
				<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
					Custom Dimensions
				</h3>
				<div class="flex items-center gap-4">
					<div class="flex-1">
						<label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
						>Width (px)</label>
						<input
							v-model.number="customWidth"
							type="number"
							min="1"
							max="10000"
							class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
						/>
					</div>
					<span class="text-gray-400 pt-5">×</span>
					<div class="flex-1">
						<label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
						>Height (px)</label>
						<input
							v-model.number="customHeight"
							type="number"
							min="1"
							max="10000"
							class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
						/>
					</div>
					<button
						class="mt-5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
						@click="createCustom"
					>
						Create
					</button>
				</div>
			</div>
		</Transition>

		<!-- Popular Presets -->
		<div v-if="selectedCategory === 'all'" class="mb-8">
			<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
				Popular Sizes
			</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
				<button
					v-for="preset in popularPresets"
					:key="preset.id"
					class="p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition-all text-left group"
					@click="selectPreset(preset)"
				>
					<div class="flex items-start justify-between mb-2">
						<i
							:class="preset.icon"
							class="text-xl text-gray-600 dark:text-gray-400 group-hover:text-blue-500"
						/>
						<span
							v-if="preset.popular"
							class="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full"
						>
							Popular
						</span>
					</div>
					<div class="font-medium text-gray-900 dark:text-white text-sm">
						{{ preset.name }}
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
						{{ preset.width }} × {{ preset.height }}
					</div>
					<div class="text-xs text-gray-400 dark:text-gray-500">
						{{ getAspectRatio(preset.width, preset.height) }}
					</div>
				</button>
			</div>
		</div>

		<!-- All Presets Grid -->
		<div>
			<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
				{{
					selectedCategory === "all"
					? "All Sizes"
					: categories.find(c => c.id === selectedCategory)?.name
				}}
			</h3>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
				<button
					v-for="preset in filteredPresets"
					:key="preset.id"
					class="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg transition-all text-left group"
					@click="selectPreset(preset)"
				>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
							<i
								:class="preset.icon"
								class="text-gray-600 dark:text-gray-400 group-hover:text-blue-500"
							/>
						</div>
						<div class="flex-1 min-w-0">
							<div class="font-medium text-gray-900 dark:text-white text-sm truncate">
								{{ preset.name }}
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								{{ preset.width }}×{{ preset.height }}
							</div>
						</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Quick Tips -->
		<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
			<div class="flex items-start gap-3">
				<i class="i-mdi-lightbulb text-blue-600 text-xl mt-0.5" />
				<div>
					<h4 class="text-sm font-medium text-blue-900 dark:text-blue-300">
						Pro Tip
					</h4>
					<p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
						Use the exact pixel dimensions for each platform to ensure your
						designs look crisp. Social media platforms often compress images, so
						starting with the right size helps maintain quality.
					</p>
				</div>
			</div>
		</div>
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
