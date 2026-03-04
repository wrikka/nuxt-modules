<script setup lang="ts">
import { computed } from "vue";
import { generateLineChartData } from "../utils/line-chart";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[];
	config?: {
		seriesCount?: number;
		pointsCount?: number;
		timeSeries?: boolean;
		dateRange?: { start: Date; end: Date };
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		seriesCount: 1,
		pointsCount: 10,
		timeSeries: false,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		let xValues: (number | Date | string)[];
		if (props.config.timeSeries) {
			// Generate date range for time series
			const startDate =
				props.config.dateRange?.start ||
				new Date(Date.now() - props.data.length * 24 * 60 * 60 * 1000);
			xValues = props.data.map(
				(_, i) => new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
			);
		} else {
			xValues = props.data.map((_, i) => i);
		}
		const yValues = props.data;
		return generateLineChartData(
			xValues as number[] | Date[] | string[],
			yValues,
			{ title: "Line Chart" },
		);
	}
	// Fallback to random data
	let xValues: (number | Date | string)[];
	if (props.config.timeSeries) {
		const startDate = new Date(
			Date.now() - (props.config.pointsCount || 10) * 24 * 60 * 60 * 1000,
		);
		xValues = Array.from(
			{ length: props.config.pointsCount || 10 },
			(_: number, i: number) =>
				new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
		);
	} else {
		xValues = Array.from(
			{ length: props.config.pointsCount || 10 },
			(_: number, i: number) => i,
		);
	}
	const yValues = Array.from({ length: props.config.pointsCount || 10 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateLineChartData(
		xValues as number[] | Date[] | string[],
		yValues,
		{ title: "Line Chart" },
	);
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
