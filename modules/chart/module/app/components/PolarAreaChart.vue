<script setup lang="ts">
import { computed } from "vue";
import { generatePolarAreaData } from "../charts/polar-area-chart";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[];
	categories?: string[];
	config?: {
		seriesName?: string;
		color?: string;
		maxValue?: number;
		startAngle?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	categories: () => [],
	config: () => ({
		seriesName: "Data",
		startAngle: 0,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		const categories =
			props.categories.length > 0
				? props.categories
				: props.data.map((_, i) => `Segment ${i + 1}`);
		return generatePolarAreaData(categories, props.data, {
			title: "Polar Area Chart",
			seriesName: props.config.seriesName,
			color: props.config.color,
			maxValue: props.config.maxValue,
			startAngle: props.config.startAngle,
		});
	}
	// Fallback to random data
	const categories =
		props.categories.length > 0
			? props.categories
			: Array.from({ length: 5 }, (_, i) => `Area ${i + 1}`);
	const values = Array.from({ length: categories.length }, () =>
		Math.floor(Math.random() * 100),
	);
	return generatePolarAreaData(categories, values, {
		title: "Polar Area Chart",
		seriesName: props.config.seriesName,
		startAngle: props.config.startAngle,
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
