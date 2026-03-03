<script setup lang="ts">
import { computed } from "vue";
import { generateHistogramData } from "../utils/histogram";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[];
	config?: {
		bins?: number;
		seriesName?: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		bins: 10,
		seriesName: "Frequency",
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		return generateHistogramData(props.data, { title: "Histogram" });
	}
	// Fallback to random data
	const randomData = Array.from({ length: 50 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateHistogramData(randomData, { title: "Histogram" });
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
