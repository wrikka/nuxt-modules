<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const timeRange = ref("30d");
const selectedMetric = ref("views");

const metrics = {
	views: { label: "Total Views", value: 15420, change: 12.5, color: "blue" },
	uses: { label: "Template Uses", value: 3847, change: 8.2, color: "green" },
	rating: { label: "Avg Rating", value: 4.7, change: 0.3, color: "yellow" },
	completion: {
		label: "Completion Rate",
		value: 78,
		change: 5.1,
		color: "purple",
	},
};

const chartData = ref([
	{ day: "Mon", views: 1200, uses: 340 },
	{ day: "Tue", views: 1900, uses: 420 },
	{ day: "Wed", views: 1600, uses: 380 },
	{ day: "Thu", views: 2100, uses: 510 },
	{ day: "Fri", views: 2400, uses: 620 },
	{ day: "Sat", views: 1800, uses: 450 },
	{ day: "Sun", views: 2200, uses: 580 },
]);

const heatmapData = ref([
	{ x: 0, y: 0, value: 85 },
	{ x: 1, y: 0, value: 45 },
	{ x: 2, y: 0, value: 30 },
	{ x: 0, y: 1, value: 60 },
	{ x: 1, y: 1, value: 90 },
	{ x: 2, y: 1, value: 55 },
	{ x: 0, y: 2, value: 25 },
	{ x: 1, y: 2, value: 40 },
	{ x: 2, y: 2, value: 75 },
]);

const topReferrers = ref([
	{ name: "Social Media", value: 45, color: "bg-blue-500" },
	{ name: "Direct Link", value: 30, color: "bg-green-500" },
	{ name: "Search Engine", value: 15, color: "bg-yellow-500" },
	{ name: "Email", value: 10, color: "bg-purple-500" },
]);

const hourlyActivity = ref([
	{ hour: "00:00", activity: 12 },
	{ hour: "04:00", activity: 5 },
	{ hour: "08:00", activity: 45 },
	{ hour: "12:00", activity: 85 },
	{ hour: "16:00", activity: 72 },
	{ hour: "20:00", activity: 55 },
	{ hour: "23:59", activity: 25 },
]);
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
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-chart-box text-violet-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Usage Dashboard
							</h2>
							<p class="text-sm text-gray-500">
								{{ props.template!.name }} - Analytics & Insights
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<select
							v-model="timeRange"
							class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
						>
							<option value="24h">Last 24 hours</option>
							<option value="7d">Last 7 days</option>
							<option value="30d">Last 30 days</option>
							<option value="90d">Last 90 days</option>
						</select>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="max-w-6xl mx-auto space-y-6">
						<!-- Metric Cards -->
						<div class="grid grid-cols-4 gap-4">
							<div
								v-for="(metric, key) in metrics"
								:key="key"
								class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
							>
								<div class="text-sm text-gray-500 mb-1">{{ metric.label }}</div>
								<div class="text-2xl font-bold text-gray-900 dark:text-white">
									{{
										key === "rating"
										? metric.value.toFixed(1)
										: metric.value.toLocaleString()
									}}
								</div>
								<div class="flex items-center gap-1 mt-2">
									<i
										:class="metric.change >= 0
										? 'i-mdi-trending-up text-green-500'
										: 'i-mdi-trending-down text-red-500'"
									/>
									<span
										:class="metric.change >= 0 ? 'text-green-600' : 'text-red-600'"
										class="text-sm font-medium"
									>
										{{ metric.change >= 0 ? "+" : "" }}{{ metric.change }}%
									</span>
									<span class="text-xs text-gray-400 ml-1">vs last period</span>
								</div>
							</div>
						</div>

						<!-- Charts Row -->
						<div class="grid grid-cols-2 gap-6">
							<!-- Line Chart -->
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									Views & Uses Over Time
								</h3>
								<div class="h-48 flex items-end gap-2">
									<div
										v-for="(data, index) in chartData"
										:key="index"
										class="flex-1 flex flex-col items-center gap-1"
									>
										<div class="w-full flex gap-1 items-end">
											<div
												class="flex-1 bg-blue-500 rounded-t"
												:style="`height: ${(data.views / 2500) * 100}px`"
											/>
											<div
												class="flex-1 bg-green-500 rounded-t"
												:style="`height: ${(data.uses / 700) * 100}px`"
											/>
										</div>
										<span class="text-xs text-gray-500">{{ data.day }}</span>
									</div>
								</div>
								<div class="flex gap-4 mt-4 justify-center">
									<div class="flex items-center gap-2">
										<div class="w-3 h-3 bg-blue-500 rounded" />
										<span class="text-xs text-gray-500">Views</span>
									</div>
									<div class="flex items-center gap-2">
										<div class="w-3 h-3 bg-green-500 rounded" />
										<span class="text-xs text-gray-500">Uses</span>
									</div>
								</div>
							</div>

							<!-- Referrers Pie -->
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									Traffic Sources
								</h3>
								<div class="space-y-3">
									<div
										v-for="referrer in topReferrers"
										:key="referrer.name"
										class="flex items-center gap-3"
									>
										<div class="w-3 h-3 rounded-full" :class="referrer.color" />
										<div class="flex-1">
											<div class="flex justify-between text-sm">
												<span class="text-gray-700 dark:text-gray-300">{{
													referrer.name
												}}</span>
												<span class="font-medium">{{ referrer.value }}%</span>
											</div>
											<div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-1 overflow-hidden">
												<div
													:class="referrer.color"
													class="h-full rounded-full"
													:style="`width: ${referrer.value}%`"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Heatmap & Hourly Activity -->
						<div class="grid grid-cols-2 gap-6">
							<!-- Click Heatmap -->
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									Template Interaction Heatmap
								</h3>
								<div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
									<img
										:src="props.template!.thumbnail"
										class="w-full h-full object-cover opacity-50"
									/>
									<div class="absolute inset-0 grid grid-cols-3 grid-rows-3">
										<div
											v-for="(cell, index) in heatmapData"
											:key="index"
											class="flex items-center justify-center"
											:style="`background-color: rgba(255, 0, 0, ${cell.value / 100})`"
										>
											<span
												class="text-xs font-medium text-white drop-shadow"
											>{{ cell.value }}%</span>
										</div>
									</div>
								</div>
								<p class="text-xs text-gray-500 mt-2">
									Shows where users interact most with your template
								</p>
							</div>

							<!-- Hourly Activity -->
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									Hourly Activity Pattern
								</h3>
								<div class="space-y-3">
									<div
										v-for="hour in hourlyActivity"
										:key="hour.hour"
										class="flex items-center gap-3"
									>
										<span class="text-xs text-gray-500 w-12">{{
											hour.hour
										}}</span>
										<div class="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
											<div
												class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
												:style="`width: ${hour.activity}%`"
											/>
										</div>
										<span class="text-xs font-medium w-8">{{
												hour.activity
											}}%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
