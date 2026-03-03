<script setup lang="ts">
interface DataPoint {
	date: string;
	value: number;
}

interface Props {
	historicalData: DataPoint[];
	forecastDays?: number;
	title?: string;
	unit?: string;
	maxValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
	forecastDays: 30,
	title: "Storage Trend Forecast",
	unit: "GB",
	maxValue: 10 * 1024 * 1024 * 1024, // 10GB default
});

// Simple linear regression for forecasting
const forecastData = computed(() => {
	if (props.historicalData.length < 2) return [];

	const data = props.historicalData.map(d => ({
		x: new Date(d.date).getTime(),
		y: d.value,
	}));

	const n = data.length;
	const sumX = data.reduce((sum, d) => sum + d.x, 0);
	const sumY = data.reduce((sum, d) => sum + d.y, 0);
	const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
	const sumXX = data.reduce((sum, d) => sum + d.x * d.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	const lastDate = new Date(
		props.historicalData[props.historicalData.length - 1]!.date,
	);
	const forecast: DataPoint[] = [];

	for (let i = 1; i <= props.forecastDays; i++) {
		const futureDate = new Date(lastDate);
		futureDate.setDate(futureDate.getDate() + i);
		const x = futureDate.getTime();
		const y = slope * x + intercept;
		forecast.push({
			date: futureDate.toISOString().split("T")[0]!,
			value: Math.max(0, y),
		});
	}

	return forecast;
});

const willReachLimit = computed(() => {
	if (!forecastData.value.length) return null;
	const lastForecast = forecastData.value[forecastData.value.length - 1]!;
	if (lastForecast.value >= props.maxValue) {
		// Find when it will reach limit
		for (const point of forecastData.value) {
			if (point.value >= props.maxValue) {
				return new Date(point.date);
			}
		}
	}
	return null;
});

const daysUntilLimit = computed(() => {
	if (!willReachLimit.value) return null;
	const today = new Date();
	const diffTime = willReachLimit.value.getTime() - today.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const currentUsage = computed(() => {
	if (!props.historicalData.length) return 0;
	return props.historicalData[props.historicalData.length - 1]!.value;
});

const percentageUsed = computed(() =>
	(currentUsage.value / props.maxValue) * 100
);
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{{ title }}
			</h3>
			<div class="flex items-center gap-2">
				<span
					class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
				>
					{{ forecastDays }}d forecast
				</span>
			</div>
		</div>

		<!-- Summary stats -->
		<div class="grid grid-cols-3 gap-4 mb-6">
			<div class="text-center">
				<div class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ (currentUsage / 1024 / 1024 / 1024).toFixed(2) }} {{ unit }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					Current Usage
				</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ percentageUsed.toFixed(1) }}%
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">Storage Used</div>
			</div>
			<div class="text-center">
				<div
					class="text-2xl font-bold"
					:class="daysUntilLimit
					? 'text-red-600 dark:text-red-400'
					: 'text-green-600 dark:text-green-400'"
				>
					{{ daysUntilLimit || "OK" }}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					{{ daysUntilLimit ? "Days until limit" : "Within limit" }}
				</div>
			</div>
		</div>

		<!-- Progress bar -->
		<div class="mb-6">
			<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
				<span>0 {{ unit }}</span>
				<span>{{ (maxValue / 1024 / 1024 / 1024).toFixed(0) }} {{ unit }}</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
					:style="{ width: `${Math.min(percentageUsed, 100)}%` }"
				/>
			</div>
			<div class="flex justify-between text-xs mt-1">
				<span class="text-gray-500 dark:text-gray-400">Current</span>
				<span
					v-if="daysUntilLimit"
					class="text-red-500 dark:text-red-400 font-medium"
				>
					Warning: Will reach limit in {{ daysUntilLimit }} days
				</span>
			</div>
		</div>

		<!-- Forecast visualization -->
		<div class="flex items-center gap-4">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-blue-500" />
				<span class="text-xs text-gray-600 dark:text-gray-400">Historical</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-purple-400 border-2 border-dashed border-purple-500" />
				<span class="text-xs text-gray-600 dark:text-gray-400">Forecast</span>
			</div>
		</div>
	</div>
</template>
