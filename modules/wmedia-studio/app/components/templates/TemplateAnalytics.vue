<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "close"): void;
}>();

const timeRange = ref<"7d" | "30d" | "90d" | "1y">("30d");

const analytics = {
	views: { value: 12543, change: 23, trend: "up" },
	uses: { value: 3892, change: 15, trend: "up" },
	conversion: { value: 31, change: -2, trend: "down" },
	saves: { value: 567, change: 8, trend: "up" },
};

const topTemplates = [
	{ name: "Instagram Story - Summer", views: 3420, uses: 890, conversion: 26 },
	{ name: "Business Card Pro", views: 2100, uses: 650, conversion: 31 },
	{ name: "Flyer - Event", views: 1850, uses: 520, conversion: 28 },
];

const trafficSources = [
	{ name: "Direct", value: 45 },
	{ name: "Social Media", value: 25 },
	{ name: "Search", value: 20 },
	{ name: "Referral", value: 10 },
];
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Template Analytics
					</h2>
					<div class="flex items-center gap-3">
						<select
							v-model="timeRange"
							class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
						>
							<option value="7d">Last 7 Days</option>
							<option value="30d">Last 30 Days</option>
							<option value="90d">Last 90 Days</option>
							<option value="1y">Last Year</option>
						</select>
						<button
							class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
							@click="$emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto p-6">
					<!-- Stats Grid -->
					<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div
							v-for="(stat, key) in analytics"
							:key="key"
							class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
						>
							<div class="text-sm text-gray-500 dark:text-gray-400 capitalize">
								{{ key }}
							</div>
							<div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
								{{
									key === "conversion"
									? stat.value + "%"
									: stat.value.toLocaleString()
								}}
							</div>
							<div
								class="flex items-center gap-1 mt-1 text-sm"
								:class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
							>
								<i
									:class="stat.trend === 'up'
									? 'i-mdi-trending-up'
									: 'i-mdi-trending-down'"
								/>
								{{ stat.change > 0 ? "+" : "" }}{{ stat.change }}%
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<!-- Top Templates -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
								Top Performing Templates
							</h3>
							<div class="space-y-3">
								<div
									v-for="(template, i) in topTemplates"
									:key="i"
									class="flex items-center gap-4"
								>
									<div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
										{{ i + 1 }}
									</div>
									<div class="flex-1">
										<div class="font-medium text-gray-900 dark:text-white">
											{{ template.name }}
										</div>
										<div class="text-sm text-gray-500 dark:text-gray-400">
											{{ template.views.toLocaleString() }} views · {{
												template.uses.toLocaleString()
											}} uses
										</div>
									</div>
									<div class="text-right">
										<div class="font-semibold text-gray-900 dark:text-white">
											{{ template.conversion }}%
										</div>
										<div class="text-xs text-gray-500 dark:text-gray-400">
											conversion
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Traffic Sources -->
						<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
								Traffic Sources
							</h3>
							<div class="space-y-3">
								<div
									v-for="source in trafficSources"
									:key="source.name"
									class="space-y-1"
								>
									<div class="flex items-center justify-between text-sm">
										<span class="text-gray-700 dark:text-gray-300">{{
											source.name
										}}</span>
										<span class="text-gray-900 dark:text-white font-medium">{{
												source.value
											}}%</span>
									</div>
									<div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
										<div
											class="h-full bg-blue-500 rounded-full"
											:style="{ width: source.value + '%' }"
										/>
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
