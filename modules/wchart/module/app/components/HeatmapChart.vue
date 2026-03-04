<script setup lang="ts">
import { computed } from "vue";
// @ts-ignore
import { generateHeatmapData } from "../utils/heatmap";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[][];
	config?: {
		xCategories?: string[];
		yCategories?: string[];
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		xCategories: [],
		yCategories: [],
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		return generateHeatmapData(props.data, { title: "Heatmap" });
	}
	// Fallback to random data
	const randomData = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
	);
	return generateHeatmapData(randomData, { title: "Heatmap" });
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
