<script setup lang="ts">
import { computed } from "vue";
import { generateControlChart, detectControlPatterns, calculateProcessCapability } from "../charts/control-chart";
import type { ChartData } from "../types/chart";

interface Props {
	samples?: number[][];
	config?: {
		title?: string;
		type?: "xbar" | "r" | "s" | "i" | "mr";
		lcl?: number;
		ucl?: number;
		target?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	samples: () => [],
	config: () => ({
		title: "Control Chart",
		type: "xbar",
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.samples.length > 0) {
		return generateControlChart(props.samples, {
			title: props.config.title,
			type: props.config.type,
			lcl: props.config.lcl,
			ucl: props.config.ucl,
			target: props.config.target,
		});
	}
	// Sample data - 20 subgroups of 5
	const sampleSubgroups = Array.from({ length: 20 }, () =>
		Array.from({ length: 5 }, () => 10 + Math.random() * 5)
	);
	return generateControlChart(sampleSubgroups, {
		title: props.config.title,
		type: props.config.type,
	});
});

const patterns = computed(() => detectControlPatterns(chartData.value));

const outOfControl = computed(() => {
	const dataSeries = chartData.value.series[0];
	const ucl = chartData.value.series[2]?.data[0]?.y as number;
	const lcl = chartData.value.series[3]?.data[0]?.y as number;
	
	if (!dataSeries) return [];
	
	return dataSeries.data.filter((d) => {
		const val = d.y as number;
		return (ucl !== undefined && val > ucl) || (lcl !== undefined && val < lcl);
	});
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Control chart: ${chartData.title}`">
    <div class="flex justify-between items-center mb-4">
      <h3 v-if="chartData.title" class="text-lg font-semibold">{{ chartData.title }}</h3>
      <span v-if="outOfControl.length > 0" class="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
        {{ outOfControl.length }} out of control
      </span>
      <span v-else class="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
        In control
      </span>
    </div>
    
    <div class="h-48 relative">
      <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <!-- Control limits (UCL/LCL) -->
        <line
          v-if="chartData.series[2]?.data[0]"
          y1="10"
          y2="10"
          x1="0"
          x2="100"
          stroke="#e15759"
          stroke-width="1"
          stroke-dasharray="4"
        />
        <line
          v-if="chartData.series[3]?.data[0]"
          y1="90"
          y2="90"
          x1="0"
          x2="100"
          stroke="#e15759"
          stroke-width="1"
          stroke-dasharray="4"
        />
        <!-- Center line -->
        <line
          v-if="chartData.series[1]?.data[0]"
          :y1="50"
          :y2="50"
          x1="0"
          x2="100"
          stroke="#333"
          stroke-width="1"
          stroke-dasharray="4"
        />
        <!-- Data line -->
        <polyline
          v-if="chartData.series[0]?.data"
          :points="chartData.series[0].data.map((d: {x: number; y: number}, i: number) => {
            const x = (i / (chartData.series[0].data.length - 1)) * 100;
            const ucl = chartData.series[2]?.data[0]?.y as number || 15;
            const lcl = chartData.series[3]?.data[0]?.y as number || 5;
            const y = 90 - ((d.y as number) - lcl) / (ucl - lcl) * 80;
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#4e79a7"
          stroke-width="2"
        />
        <!-- Data points -->
        <circle
          v-for="(d, i) in chartData.series[0]?.data || []"
          :key="`point-${i}`"
          :cx="(i / (chartData.series[0].data.length - 1)) * 100"
          :cy="90 - ((d.y as number) - ((chartData.series[3]?.data[0]?.y as number) || 5)) / (((chartData.series[2]?.data[0]?.y as number) || 15) - ((chartData.series[3]?.data[0]?.y as number) || 5)) * 80"
          r="3"
          :fill="(d.outOfControl as boolean) ? '#e15759' : '#4e79a7'"
        />
      </svg>
    </div>
    
    <!-- Pattern detection -->
    <div v-if="patterns.length > 0" class="mt-3">
      <div class="text-sm font-medium mb-2">Detected Patterns:</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(pattern, i) in patterns.slice(0, 3)"
          :key="i"
          class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
        >
          {{ pattern.description }}
        </span>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="flex gap-4 mt-3 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 border-t border-dashed" style="border-color: #e15759"></div>
        <span>UCL/LCL</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 border-t border-dashed border-gray-700"></div>
        <span>Center</span>
      </div>
    </div>
  </div>
</template>
