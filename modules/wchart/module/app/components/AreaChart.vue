<script setup lang="ts">
import { computed } from "vue";
import { generateAreaChartData } from "../utils/area-chart";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[];
	config?: {
		seriesCount?: number;
		pointsCount?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		seriesCount: 1,
		pointsCount: 10,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		const xValues = props.data.map((_, i) => i);
		const yValues = props.data;
		return generateAreaChartData(xValues, yValues, { title: "Area Chart" });
	}
	// Fallback to random data
	const xValues = Array.from(
		{ length: props.config.pointsCount || 10 },
		(_: number, i: number) => i,
	);
	const yValues = Array.from({ length: props.config.pointsCount || 10 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateAreaChartData(xValues, yValues, { title: "Area Chart" });
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg">
    <h3 v-if="chartData.title" class="mb-4 text-lg font-semibold">{{ chartData.title }}</h3>
    <div class="min-h-50 flex items-center justify-center bg-gray-100">
      <!-- Chart rendering would go here -->
      <pre class="text-sm">{{ JSON.stringify(chartData, null, 2) }}</pre>
    </div>
  </div>
</template>
