<script setup lang="ts">
import { computed } from "vue";
import { generateScatterData } from "../charts/scatter-chart";
import type { ScatterData } from "../types/chart-types";

interface Props {
	data?: Array<{ x: number; y: number }>;
	config?: {
		seriesName?: string;
		color?: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		seriesName: "Points",
	}),
});

const chartData = computed<ScatterData>(() => {
	if (props.data.length > 0) {
		const xValues = props.data.map((p) => p.x);
		const yValues = props.data.map((p) => p.y);
		return generateScatterData(xValues, yValues, {
			title: "Scatter Chart",
			seriesName: props.config.seriesName,
			color: props.config.color,
		});
	}
	// Fallback to random data
	const xValues = Array.from({ length: 20 }, () =>
		Math.floor(Math.random() * 100),
	);
	const yValues = Array.from({ length: 20 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateScatterData(xValues, yValues, {
		title: "Scatter Chart",
		seriesName: props.config.seriesName,
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
