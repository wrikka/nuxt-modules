<script setup lang="ts">
import { computed } from "vue";
import { generateRadarData } from "../charts/radar-chart";
import type { ChartData } from "../types/chart-types";

interface Props {
	data?: number[];
	categories?: string[];
	config?: {
		seriesName?: string;
		color?: string;
		maxValue?: number;
		levels?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	categories: () => [],
	config: () => ({
		seriesName: "Data",
		levels: 5,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		const categories =
			props.categories.length > 0
				? props.categories
				: props.data.map((_, i) => `Category ${i + 1}`);
		return generateRadarData(categories, props.data, {
			title: "Radar Chart",
			seriesName: props.config.seriesName,
			color: props.config.color,
			maxValue: props.config.maxValue,
			levels: props.config.levels,
		});
	}
	// Fallback to random data
	const categories =
		props.categories.length > 0
			? props.categories
			: Array.from({ length: 6 }, (_, i) => `Skill ${i + 1}`);
	const values = Array.from({ length: categories.length }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateRadarData(categories, values, {
		title: "Radar Chart",
		seriesName: props.config.seriesName,
		levels: props.config.levels,
	});
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg">
    <h3 v-if="chartData.title">{{ chartData.title }}</h3>
    <div class="min-h-50 flex items-center justify-center bg-gray-100">
      <!-- Chart rendering would go here -->
      <pre>{{ JSON.stringify(chartData, null, 2) }}</pre>
    </div>
  </div>
</template>
