<script setup lang="ts">
import { computed } from "vue";
import { generateViolinData, calculateBubbleCorrelation, type ViolinData } from "../charts/violin";
import type { ChartData } from "../types/chart";

interface Props {
	datasets?: ViolinData[];
	config?: {
		title?: string;
		showBox?: boolean;
		showMedian?: boolean;
		showMean?: boolean;
		bandwidth?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	datasets: () => [],
	config: () => ({
		title: "Violin Plot",
		showBox: true,
		showMedian: true,
		showMean: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.datasets.length > 0) {
		return generateViolinData(props.datasets, {
			title: props.config.title,
			showBox: props.config.showBox,
			showMedian: props.config.showMedian,
			showMean: props.config.showMean,
			bandwidth: props.config.bandwidth,
		});
	}
	// Sample data
	const sampleData: ViolinData[] = [
		{
			category: "Group A",
			values: Array.from({ length: 100 }, () => Math.random() * 50 + 50),
		},
		{
			category: "Group B",
			values: Array.from({ length: 100 }, () => Math.random() * 60 + 40),
		},
		{
			category: "Group C",
			values: Array.from({ length: 100 }, () => Math.random() * 40 + 60),
		},
	];
	return generateViolinData(sampleData, {
		title: props.config.title,
		showBox: props.config.showBox,
		showMedian: props.config.showMedian,
		showMean: props.config.showMean,
	});
});

const stats = computed(() => {
	if (props.datasets.length < 2) return null;
	return props.datasets.map((d) => {
		const sorted = [...d.values].sort((a, b) => a - b);
		const n = sorted.length;
		const min = sorted[0] || 0;
		const max = sorted[n - 1] || 0;
		const median = n % 2 === 0
			? ((sorted[n / 2 - 1] || 0) + (sorted[n / 2] || 0)) / 2
			: sorted[Math.floor(n / 2)] || 0;
		const mean = d.values.reduce((sum, v) => sum + v, 0) / n;
		return { category: d.category, min, max, median, mean, count: n };
	});
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Violin plot: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="flex items-center justify-around h-48 px-4">
      <div
        v-for="(series, idx) in chartData.series"
        :key="series.name"
        class="flex flex-col items-center"
      >
        <!-- Violin shape -->
        <div class="relative w-24 h-32">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <!-- Violin path -->
            <path
              :d="series.data.length > 0 ? 
                `M 50,0 ${series.data.map((d, i) => {
                  const y = i / series.data.length * 100;
                  const width = (d.density || 0) * 80;
                  return `Q ${50 + width/2},${y} 50,${y}`;
                }).join(' ')} 
                L 50,100 
                ${series.data.map((d, i) => {
                  const y = (series.data.length - 1 - i) / series.data.length * 100;
                  const width = (d.density || 0) * 80;
                  return `Q ${50 - width/2},${y} 50,${y}`;
                }).join(' ')} Z` : ''"
              :fill="series.color || '#4e79a7'"
              fill-opacity="0.6"
              stroke="#333"
              stroke-width="1"
            />
            <!-- Box plot overlay -->
            <rect
              v-if="config.showBox && series.data[0]?.stats"
              :y="50 - ((series.data[0].stats?.median || 0) - (series.data[0].stats?.q1 || 0)) * 2"
              :height="((series.data[0].stats?.q3 || 0) - (series.data[0].stats?.q1 || 0)) * 2"
              x="40"
              width="20"
              fill="rgba(255,255,255,0.7)"
              stroke="#333"
            />
          </svg>
        </div>
        <span class="text-sm font-medium mt-2">{{ series.name }}</span>
      </div>
    </div>

    <!-- Statistics table -->
    <div v-if="stats && stats.length > 0" class="mt-4 text-sm">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-1">Category</th>
            <th class="py-1">Count</th>
            <th class="py-1">Min</th>
            <th class="py-1">Max</th>
            <th class="py-1">Median</th>
            <th class="py-1">Mean</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in stats" :key="stat.category" class="border-b">
            <td class="py-1">{{ stat.category }}</td>
            <td class="py-1">{{ stat.count }}</td>
            <td class="py-1">{{ stat.min.toFixed(1) }}</td>
            <td class="py-1">{{ stat.max.toFixed(1) }}</td>
            <td class="py-1">{{ stat.median.toFixed(1) }}</td>
            <td class="py-1">{{ stat.mean.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
