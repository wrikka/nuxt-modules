<script setup lang="ts">
import { computed } from "vue";
import { generateBarChartData } from "../charts/bar-chart";
import type { ChartData } from "../types/chart";

interface Props {
	data?: number[];
	config?: {
		seriesCount?: number;
		pointsCount?: number;
		zoomEnabled?: boolean;
		panEnabled?: boolean;
		zoomLevel?: number;
		panOffset?: { x: number; y: number };
	};
}

interface Props {
	data?: number[];
	config?: {
		seriesCount?: number;
		pointsCount?: number;
		zoomEnabled?: boolean;
		panEnabled?: boolean;
		zoomLevel?: number;
		panOffset?: { x: number; y: number };
		drillDownEnabled?: boolean;
		multiAxis?: boolean;
		virtualScroll?: boolean;
		maxItems?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	config: () => ({
		seriesCount: 1,
		pointsCount: 10,
		zoomEnabled: false,
		panEnabled: false,
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
		drillDownEnabled: false,
		multiAxis: false,
		virtualScroll: false,
		maxItems: 100,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.data.length > 0) {
		const categories = props.data.map((_, i) => `Category ${i + 1}`);
		const values = props.data;
		return generateBarChartData(categories, values, { title: "Bar Chart" });
	}
	// Fallback to random data
	const categories = Array.from(
		{ length: props.config.pointsCount || 10 },
		(_: number, i: number) => `Item ${i + 1}`,
	);
	const values = Array.from({ length: props.config.pointsCount || 10 }, () =>
		Math.floor(Math.random() * 100),
	);
	return generateBarChartData(categories, values, { title: "Bar Chart" });
});

const emit = defineEmits<{
	drillDown: [data: any];
	zoom: [level: number];
	pan: [offset: { x: number; y: number }];
}>();

const zoomIn = () => {
	if (props.config.zoomEnabled) {
		const newLevel = (props.config.zoomLevel || 1) * 1.2;
		emit("zoom", newLevel);
	}
};

const zoomOut = () => {
	if (props.config.zoomEnabled) {
		const newLevel = (props.config.zoomLevel || 1) / 1.2;
		emit("zoom", newLevel);
	}
};

const panLeft = () => {
	if (props.config.panEnabled) {
		const offset = props.config.panOffset || { x: 0, y: 0 };
		emit("pan", { x: offset.x - 10, y: offset.y });
	}
};

const panRight = () => {
	if (props.config.panEnabled) {
		const offset = props.config.panOffset || { x: 0, y: 0 };
		emit("pan", { x: offset.x + 10, y: offset.y });
	}
};

const onDrillDown = (event: MouseEvent) => {
	if (props.config.drillDownEnabled) {
		// In a real implementation, would determine which data point was clicked
		emit("drillDown", { event, data: chartData.value });
	}
};

const handleKeydown = (event: KeyboardEvent) => {
	// Basic keyboard navigation for accessibility
	switch (event.key) {
		case "Enter":
		case " ":
			// Could trigger some action, for now just prevent default
			event.preventDefault();
			break;
		case "ArrowRight":
		case "ArrowLeft":
			// Navigate between data points
			event.preventDefault();
			break;
		default:
			break;
	}
};
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Bar chart: ${chartData.title || 'Data visualization'}`" tabindex="0" @keydown="handleKeydown">
    <div class="flex justify-between items-center mb-2">
      <h3 v-if="chartData.title">{{ chartData.title }}</h3>
      <div v-if="props.config.zoomEnabled || props.config.panEnabled" class="flex gap-2">
        <button v-if="props.config.zoomEnabled" @click="zoomIn" class="px-2 py-1 bg-blue-500 text-white rounded text-sm">Zoom In</button>
        <button v-if="props.config.zoomEnabled" @click="zoomOut" class="px-2 py-1 bg-blue-500 text-white rounded text-sm">Zoom Out</button>
        <button v-if="props.config.panEnabled" @click="panLeft" class="px-2 py-1 bg-gray-500 text-white rounded text-sm">Pan Left</button>
        <button v-if="props.config.panEnabled" @click="panRight" class="px-2 py-1 bg-gray-500 text-white rounded text-sm">Pan Right</button>
      </div>
    </div>
    <div class="min-h-50 flex items-center justify-center bg-gray-100" @click="onDrillDown">
      <!-- Chart rendering would go here -->
      <pre>{{ JSON.stringify(chartData, null, 2) }}</pre>
    </div>
  </div>
</template>
