<script setup lang="ts">
import { computed } from "vue";
import { generateRidgelineData, calculateRidgelineStats, findRidgelinePeaks } from "../charts/ridgeline";
import type { ChartData } from "../types/chart";

interface Props {
	datasets?: Array<{
		name: string;
		values: number[];
	}>;
	config?: {
		title?: string;
		overlap?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	datasets: () => [],
	config: () => ({
		title: "Ridgeline Plot",
		overlap: 0.7,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.datasets.length > 0) {
		const categories = props.datasets.map((d) => d.name);
		return generateRidgelineData(categories, props.datasets, {
			title: props.config.title,
			overlap: props.config.overlap,
		});
	}
	// Sample data
	const sampleDatasets = [
		{ name: "Morning", values: Array.from({ length: 100 }, () => Math.random() * 30 + 60) },
		{ name: "Afternoon", values: Array.from({ length: 100 }, () => Math.random() * 40 + 70) },
		{ name: "Evening", values: Array.from({ length: 100 }, () => Math.random() * 35 + 55) },
		{ name: "Night", values: Array.from({ length: 100 }, () => Math.random() * 25 + 40) },
	];
	const categories = sampleDatasets.map((d) => d.name);
	return generateRidgelineData(categories, sampleDatasets, {
		title: props.config.title,
		overlap: props.config.overlap,
	});
});

const stats = computed(() => calculateRidgelineStats(chartData.value));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Ridgeline plot: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="space-y-0">
      <div
        v-for="(series, idx) in chartData.series"
        :key="series.name"
        class="relative h-12 -mt-6 first:mt-0"
        :style="{ zIndex: chartData.series.length - idx }"
      >
        <div class="flex items-center gap-2">
          <span class="w-20 text-sm text-right truncate">{{ series.name }}</span>
          <svg viewBox="0 0 100 50" class="flex-1 h-12" preserveAspectRatio="none">
            <path
              :d="series.data.length > 0 ? 
                `M 0,50 ${series.data.map((d: {x: number; y: number}, i: number) => {
                  const x = (i / (series.data.length - 1)) * 100;
                  const y = 50 - (d.y as number) * 50;
                  return `L ${x},${y}`;
                }).join(' ')} L 100,50 Z` : ''"
              :fill="series.color || '#4e79a7'"
              fill-opacity="0.7"
              stroke="#333"
              stroke-width="1"
            />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Stats summary -->
    <div v-if="stats && stats.length > 0" class="mt-4 text-sm">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-xs text-gray-600">
            <th class="py-1">Category</th>
            <th class="py-1">Peak</th>
            <th class="py-1">Mean</th>
            <th class="py-1">Spread</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in stats" :key="stat.category" class="border-b">
            <td class="py-1">{{ stat.category }}</td>
            <td class="py-1">{{ stat.peakValue.toFixed(1) }}</td>
            <td class="py-1">{{ stat.mean.toFixed(1) }}</td>
            <td class="py-1">{{ stat.spread.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
