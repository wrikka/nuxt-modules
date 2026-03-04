<script setup lang="ts">
import { computed } from "vue";
import { generateBubbleData } from "../charts/bubble-chart";
import type { ChartData } from "../types/chart";

interface Props {
	data?: Array<{ x: number; y: number; size: number }>;
	config?: {
		seriesName?: string;
		color?: string;
		minSize?: number;
		maxSize?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		seriesName: "Bubbles",
		minSize: 5,
		maxSize: 50,
	}),
});

const chartData = computed<ScatterData>(() => {
	if (props.data.length > 0) {
		const xValues = props.data.map((p) => p.x);
		const yValues = props.data.map((p) => p.y);
		const sizes = props.data.map((p) => p.size);
		return generateBubbleData(xValues, yValues, sizes, {
			title: "Bubble Chart",
			seriesName: props.config.seriesName,
			color: props.config.color,
			minSize: props.config.minSize,
			maxSize: props.config.maxSize,
		});
	}
	// Fallback to random data
	const xValues = Array.from({ length: 15 }, () =>
		Math.floor(Math.random() * 100),
	);
	const yValues = Array.from({ length: 15 }, () =>
		Math.floor(Math.random() * 100),
	);
	const sizes = Array.from(
		{ length: 15 },
		() => Math.floor(Math.random() * 100) + 10,
	);
	return generateBubbleData(xValues, yValues, sizes, {
		title: "Bubble Chart",
		seriesName: props.config.seriesName,
		minSize: props.config.minSize,
		maxSize: props.config.maxSize,
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
