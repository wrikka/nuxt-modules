<script setup lang="ts">
export interface ArtboardPreset {
	id: string;
	name: string;
	width: number;
	height: number;
	category: string;
	icon: string;
}

const presets: ArtboardPreset[] = [
	// Social Media
	{
		id: "instagram-square",
		name: "Instagram Post",
		width: 1080,
		height: 1080,
		category: "social",
		icon: "square",
	},
	{
		id: "instagram-story",
		name: "Instagram Story",
		width: 1080,
		height: 1920,
		category: "social",
		icon: "portrait",
	},
	{
		id: "instagram-reel",
		name: "Instagram Reel",
		width: 1080,
		height: 1920,
		category: "social",
		icon: "portrait",
	},
	{
		id: "facebook-post",
		name: "Facebook Post",
		width: 1200,
		height: 630,
		category: "social",
		icon: "landscape",
	},
	{
		id: "facebook-cover",
		name: "Facebook Cover",
		width: 820,
		height: 312,
		category: "social",
		icon: "banner",
	},
	{
		id: "twitter-post",
		name: "Twitter/X Post",
		width: 1200,
		height: 675,
		category: "social",
		icon: "landscape",
	},
	{
		id: "twitter-header",
		name: "Twitter Header",
		width: 1500,
		height: 500,
		category: "social",
		icon: "banner",
	},
	{
		id: "linkedin-post",
		name: "LinkedIn Post",
		width: 1200,
		height: 627,
		category: "social",
		icon: "landscape",
	},
	{
		id: "pinterest-pin",
		name: "Pinterest Pin",
		width: 1000,
		height: 1500,
		category: "social",
		icon: "portrait",
	},
	{
		id: "youtube-thumbnail",
		name: "YouTube Thumbnail",
		width: 1280,
		height: 720,
		category: "social",
		icon: "landscape",
	},
	{
		id: "youtube-banner",
		name: "YouTube Banner",
		width: 2560,
		height: 1440,
		category: "social",
		icon: "banner",
	},
	{
		id: "tiktok-video",
		name: "TikTok Video",
		width: 1080,
		height: 1920,
		category: "social",
		icon: "portrait",
	},

	// Print
	{
		id: "a4",
		name: "A4 Paper",
		width: 2480,
		height: 3508,
		category: "print",
		icon: "portrait",
	},
	{
		id: "a4-landscape",
		name: "A4 Landscape",
		width: 3508,
		height: 2480,
		category: "print",
		icon: "landscape",
	},
	{
		id: "a5",
		name: "A5 Paper",
		width: 1748,
		height: 2480,
		category: "print",
		icon: "portrait",
	},
	{
		id: "business-card",
		name: "Business Card",
		width: 1050,
		height: 600,
		category: "print",
		icon: "landscape",
	},
	{
		id: "letter",
		name: "US Letter",
		width: 2550,
		height: 3300,
		category: "print",
		icon: "portrait",
	},

	// Web
	{
		id: "web-fullhd",
		name: "Full HD (1920×1080)",
		width: 1920,
		height: 1080,
		category: "web",
		icon: "landscape",
	},
	{
		id: "web-macbook",
		name: "MacBook Pro 14\"",
		width: 3024,
		height: 1964,
		category: "web",
		icon: "landscape",
	},
	{
		id: "web-ipad",
		name: "iPad Pro 12.9\"",
		width: 2048,
		height: 2732,
		category: "web",
		icon: "portrait",
	},
	{
		id: "web-iphone",
		name: "iPhone 15 Pro Max",
		width: 1290,
		height: 2796,
		category: "web",
		icon: "portrait",
	},

	// Presentation
	{
		id: "ppt-16-9",
		name: "Presentation 16:9",
		width: 1920,
		height: 1080,
		category: "presentation",
		icon: "landscape",
	},
	{
		id: "ppt-4-3",
		name: "Presentation 4:3",
		width: 1024,
		height: 768,
		category: "presentation",
		icon: "landscape",
	},

	// Ads
	{
		id: "ad-google",
		name: "Google Display Ad",
		width: 300,
		height: 250,
		category: "ads",
		icon: "rectangle",
	},
	{
		id: "ad-leaderboard",
		name: "Leaderboard Ad",
		width: 728,
		height: 90,
		category: "ads",
		icon: "banner",
	},
	{
		id: "ad-skyscraper",
		name: "Skyscraper Ad",
		width: 160,
		height: 600,
		category: "ads",
		icon: "portrait",
	},
];

const categories = [
	{ id: "all", name: "All" },
	{ id: "social", name: "Social Media" },
	{ id: "print", name: "Print" },
	{ id: "web", name: "Web/Mobile" },
	{ id: "presentation", name: "Presentation" },
	{ id: "ads", name: "Ads" },
];

const activeCategory = ref("social");

const filteredPresets = computed(() =>
	activeCategory.value === "all"
		? presets
		: presets.filter(p => p.category === activeCategory.value)
);

const emit = defineEmits<{
	(e: "select", preset: ArtboardPreset): void;
	(e: "custom"): void;
}>();
</script>

<template>
	<div class="space-y-3">
		<div class="flex gap-1 overflow-x-auto pb-1">
			<button
				v-for="cat in categories"
				:key="cat.id"
				type="button"
				class="px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors"
				:class="activeCategory === cat.id
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="activeCategory = cat.id"
			>
				{{ cat.name }}
			</button>
		</div>

		<div class="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
			<button
				v-for="preset in filteredPresets"
				:key="preset.id"
				type="button"
				class="p-3 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
				@click="$emit('select', preset)"
			>
				<div class="flex items-center gap-2 mb-2">
					<div
						class="w-8 h-6 border-2 border-gray-400 dark:border-gray-500 rounded-sm"
						:style="{
							aspectRatio: preset.width / preset.height,
							maxWidth: '100%',
							maxHeight: '24px',
						}"
					/>
				</div>
				<div class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
					{{ preset.name }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					{{ preset.width }}×{{ preset.height }}
				</div>
			</button>
		</div>

		<button
			type="button"
			class="w-full p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
			@click="$emit('custom')"
		>
			+ Custom Size
		</button>
	</div>
</template>
