<script setup lang="ts">
import { computed } from "vue";
import { generatePieChartData } from "../utils/pie-chart";
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
		const labels = props.data.map((_, i) => `Slice ${i + 1}`);
		const values = props.data;
		return generatePieChartData(labels, values, { title: "Pie Chart" });
	}
	// Fallback to random data
	const labels = Array.from(
		{ length: props.config.pointsCount || 5 },
		(_: number, i: number) => `Item ${i + 1}`,
	);
	const values = Array.from({ length: props.config.pointsCount || 5 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generatePieChartData(labels, values, { title: "Pie Chart" });
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
