<script setup lang="ts">
interface Metric {
	label: string;
	value: string;
	change: number;
	icon: string;
}

interface PlatformData {
	name: string;
	icon: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	engagement: number;
}

const dateRange = ref("7d");
const selectedPlatform = ref("all");

const metrics = ref<Metric[]>([
	{ label: "Total Views", value: "1.2M", change: 23.5, icon: "mdi:eye" },
	{ label: "Engagement Rate", value: "8.4%", change: 12.3, icon: "mdi:heart" },
	{ label: "Avg Watch Time", value: "2:45", change: -5.2, icon: "mdi:clock" },
	{
		label: "Subscribers",
		value: "45.2K",
		change: 18.7,
		icon: "mdi:account-plus",
	},
]);

const platforms = ref<PlatformData[]>([
	{
		name: "YouTube",
		icon: "mdi:youtube",
		views: 450000,
		likes: 12000,
		comments: 850,
		shares: 2300,
		engagement: 7.2,
	},
	{
		name: "TikTok",
		icon: "mdi:music-note",
		views: 380000,
		likes: 28000,
		comments: 1200,
		shares: 5600,
		engagement: 12.5,
	},
	{
		name: "Instagram",
		icon: "mdi:instagram",
		views: 250000,
		likes: 15000,
		comments: 450,
		shares: 1800,
		engagement: 6.8,
	},
	{
		name: "Facebook",
		icon: "mdi:facebook",
		views: 120000,
		likes: 5200,
		comments: 320,
		shares: 890,
		engagement: 5.1,
	},
]);

const topVideos = ref([
	{
		title: "Summer Vlog 2024",
		views: "245K",
		engagement: "12.4%",
		thumbnail: "/thumbs/summer.jpg",
	},
	{
		title: "Product Review",
		views: "189K",
		engagement: "9.8%",
		thumbnail: "/thumbs/product.jpg",
	},
	{
		title: "Tutorial Series",
		views: "156K",
		engagement: "15.2%",
		thumbnail: "/thumbs/tutorial.jpg",
	},
]);

const audienceData = ref({
	demographics: [
		{ age: "18-24", percentage: 35 },
		{ age: "25-34", percentage: 42 },
		{ age: "35-44", percentage: 18 },
		{ age: "45+", percentage: 5 },
	],
	topCountries: [
		{ name: "United States", percentage: 45 },
		{ name: "United Kingdom", percentage: 15 },
		{ name: "Canada", percentage: 12 },
		{ name: "Australia", percentage: 8 },
	],
});

function formatNumber(num: number): string {
	if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
	if (num >= 1000) return (num / 1000).toFixed(1) + "K";
	return num.toString();
}
</script>

<template>
	<div class="performance-dashboard">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:chart-bar" class="mr-2" />
			Content Performance Dashboard
		</h2>
		<p class="text-gray-500 mb-6">
			Track views, engagement, heatmaps across platforms
		</p>

		<!-- Date Range & Platform Filter -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex gap-2">
				<button
					v-for='range in ["24h", "7d", "30d", "90d"]'
					:key="range"
					class="px-3 py-1 rounded text-sm"
					:class="dateRange === range
					? 'bg-blue-600 text-white'
					: 'border hover:bg-gray-50'"
					@click="dateRange = range"
				>
					{{ range }}
				</button>
			</div>
			<select v-model="selectedPlatform" class="border rounded px-3 py-1">
				<option value="all">All Platforms</option>
				<option v-for="p in platforms" :key="p.name" :value="p.name">
					{{ p.name }}
				</option>
			</select>
		</div>

		<!-- Key Metrics -->
		<div class="grid grid-cols-4 gap-4 mb-6">
			<div
				v-for="metric in metrics"
				:key="metric.label"
				class="bg-gray-50 rounded-lg p-4"
			>
				<div class="flex items-center justify-between mb-2">
					<Icon :name="metric.icon" class="text-gray-400" />
					<span
						class="text-xs px-2 py-0.5 rounded"
						:class="metric.change >= 0
						? 'bg-green-100 text-green-700'
						: 'bg-red-100 text-red-700'"
					>
						{{ metric.change >= 0 ? "+" : "" }}{{ metric.change }}%
					</span>
				</div>
				<div class="text-2xl font-bold">{{ metric.value }}</div>
				<div class="text-sm text-gray-500">{{ metric.label }}</div>
			</div>
		</div>

		<!-- Platform Breakdown -->
		<div class="grid grid-cols-2 gap-6 mb-6">
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-4">Platform Performance</h3>
				<div class="space-y-3">
					<div
						v-for="platform in platforms"
						:key="platform.name"
						class="flex items-center gap-3 p-3 bg-white rounded-lg"
					>
						<Icon :name="platform.icon" class="text-2xl" />
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<span class="font-medium">{{ platform.name }}</span>
								<span class="text-sm font-medium">{{
										formatNumber(platform.views)
									}} views</span>
							</div>
							<div class="flex items-center gap-4 text-xs text-gray-500 mt-1">
								<span>{{ formatNumber(platform.likes) }} likes</span>
								<span>{{ formatNumber(platform.comments) }} comments</span>
								<span>{{ formatNumber(platform.shares) }} shares</span>
							</div>
						</div>
						<div class="text-right">
							<div class="text-sm font-medium text-blue-600">
								{{ platform.engagement }}%
							</div>
							<div class="text-xs text-gray-500">engagement</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Audience Demographics -->
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold mb-4">Audience Demographics</h3>

				<div class="mb-4">
					<p class="text-sm text-gray-500 mb-2">Age Distribution</p>
					<div class="space-y-2">
						<div
							v-for="demo in audienceData.demographics"
							:key="demo.age"
							class="flex items-center gap-2"
						>
							<span class="text-sm w-12">{{ demo.age }}</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-600 h-2 rounded-full"
									:style="{ width: `${demo.percentage}%` }"
								/>
							</div>
							<span class="text-sm w-8">{{ demo.percentage }}%</span>
						</div>
					</div>
				</div>

				<div>
					<p class="text-sm text-gray-500 mb-2">Top Countries</p>
					<div class="space-y-1">
						<div
							v-for="country in audienceData.topCountries"
							:key="country.name"
							class="flex items-center justify-between text-sm"
						>
							<span>{{ country.name }}</span>
							<span class="text-gray-500">{{ country.percentage }}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Top Performing Content -->
		<div class="bg-gray-50 rounded-lg p-4 mb-6">
			<h3 class="font-semibold mb-4">Top Performing Content</h3>
			<div class="grid grid-cols-3 gap-4">
				<div
					v-for="video in topVideos"
					:key="video.title"
					class="bg-white rounded-lg overflow-hidden"
				>
					<div class="aspect-video bg-gray-200" />
					<div class="p-3">
						<p class="font-medium text-sm mb-1 truncate">{{ video.title }}</p>
						<div class="flex items-center justify-between text-xs text-gray-500">
							<span>{{ video.views }} views</span>
							<span class="text-green-600">{{ video.engagement }}
								engagement</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Heatmap -->
		<div class="bg-gray-50 rounded-lg p-4">
			<h3 class="font-semibold mb-4">Engagement Heatmap</h3>
			<div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
				<div class="text-center">
					<Icon name="mdi:heat-map" class="text-4xl text-gray-400 mb-2" />
					<p class="text-gray-500">Video engagement heatmap visualization</p>
					<p class="text-sm text-gray-400">
						Shows where viewers drop off or rewatch
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.performance-dashboard {
	padding: 1.5rem;
}
</style>
