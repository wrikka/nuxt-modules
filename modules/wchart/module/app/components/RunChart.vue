<script setup lang="ts">
import { computed } from "vue";
import { generateRunChart, detectRuns, calculateRunStats } from "../charts/run-chart";
import type { ChartData } from "../types/chart";

interface Props {
	values?: number[];
	labels?: string[];
	config?: {
		title?: string;
		showMedian?: boolean;
		showTrend?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	values: () => [],
	labels: () => [],
	config: () => ({
		title: "Run Chart",
		showMedian: true,
		showTrend: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.values.length > 0) {
		return generateRunChart(props.values, props.labels, {
			title: props.config.title,
			showMedian: props.config.showMedian,
			showTrend: props.config.showTrend,
		});
	}
	// Sample data
	const sampleValues = Array.from({ length: 30 }, (_, i) => 50 + Math.sin(i * 0.3) * 10 + (Math.random() - 0.5) * 5);
	const sampleLabels = sampleValues.map((_, i) => `${i + 1}`);
	return generateRunChart(sampleValues, sampleLabels, {
		title: props.config.title,
		showMedian: props.config.showMedian,
		showTrend: props.config.showTrend,
	});
});

const runs = computed(() => detectRuns(chartData.value, 7));
const stats = computed(() => calculateRunStats(props.values.length > 0 ? props.values : chartData.value.series[0]?.data.map((d: {y: number}) => d.y) || []));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Run chart: ${chartData.title}`">
    <div class="flex justify-between items-center mb-4">
      <h3 v-if="chartData.title" class="text-lg font-semibold">{{ chartData.title }}</h3>
      <div class="flex gap-2">
        <span class="text-xs bg-gray-100 px-2 py-1 rounded">
          Median crossings: {{ stats?.crossings || 0 }}
        </span>
      </div>
    </div>
    
    <div class="h-48 relative">
      <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <!-- Median line -->
        <line
          v-if="config.showMedian && chartData.series[1]?.data[0]"
          y1="50"
          y2="50"
          x1="0"
          x2="100"
          stroke="#e15759"
          stroke-width="1"
          stroke-dasharray="4"
        />
        
        <!-- Trend line -->
        <line
          v-if="config.showTrend && chartData.series[2]?.data"
          :x1="0"
          :y1="90 - (chartData.series[2].data[0]?.y as number) / 100 * 80"
          :x2="100"
          :y2="90 - (chartData.series[2].data[chartData.series[2].data.length - 1]?.y as number) / 100 * 80"
          stroke="#59a14f"
          stroke-width="1"
          stroke-dasharray="4"
        />
        
        <!-- Data line -->
        <polyline
          v-if="chartData.series[0]?.data"
          :points="chartData.series[0].data.map((d: {x: string | number | Date; y: number}, i: number) => {
            const x = (i / (chartData.series[0].data.length - 1)) * 100;
            const y = 90 - (d.y as number) / 100 * 80;
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#4e79a7"
          stroke-width="2"
        />
        
        <!-- Data points -->
        <circle
          v-for="(d, i) in chartData.series[0]?.data || []"
          :key="`pt-${i}`"
          :cx="(i / ((chartData.series[0]?.data.length || 1) - 1)) * 100"
          :cy="90 - (d.y as number) / 100 * 80"
          r="2"
          :fill="d.aboveMedian ? '#4e79a7' : '#e15759'"
        />
      </svg>
    </div>
    
    <!-- Stats -->
    <div class="mt-3 grid grid-cols-4 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Longest Run</div>
        <div class="font-semibold">{{ stats?.longestRun || 0 }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Trend</div>
        <div class="font-semibold capitalize">{{ stats?.trend }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Autocorr</div>
        <div class="font-semibold">{{ (stats?.autocorrelation || 0).toFixed(2) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Runs >7</div>
        <div class="font-semibold" :class="runs.length > 0 ? 'text-red-600' : ''">{{ runs.length }}</div>
      </div>
    </div>
    
    <!-- Run alerts -->
    <div v-if="runs.length > 0" class="mt-2 text-sm">
      <div class="text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
        ⚠️ {{ runs.length }} run(s) of 7+ points detected
      </div>
    </div>
  </div>
</template>
