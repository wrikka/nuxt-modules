<script setup lang="ts">
import { computed } from "vue";
import { generateTreemapData } from "../utils/treemap";
import type { ChartData } from "../types/chart";

interface Props {
	data?: Array<{
		name: string;
		value: number;
		color?: string;
		children?: any[];
	}>;
	config?: {
		title?: string;
		padding?: number;
		round?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		title: "Treemap Chart",
		padding: 2,
		round: false,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		return generateTreemapData(props.data, props.config);
	}
	// Fallback to sample data
	const sampleData = [
		{ name: "A", value: 10 },
		{ name: "B", value: 20 },
		{
			name: "C",
			value: 30,
			children: [
				{ name: "C1", value: 15 },
				{ name: "C2", value: 15 },
			],
		},
		{ name: "D", value: 40 },
	];
	return generateTreemapData(sampleData, props.config);
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
