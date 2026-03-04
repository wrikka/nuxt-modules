<script setup lang="ts">
import { computed } from "vue";
import { generateHorizonChart, calculateHorizonDensity, findHorizonPeaks } from "../charts/horizon-chart";
import type { ChartData } from "../types/chart";

interface Props {
	timePoints?: number[];
	values?: number[];
	config?: {
		title?: string;
		bands?: number;
		positiveColor?: string;
		negativeColor?: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	timePoints: () => [],
	values: () => [],
	config: () => ({
		title: "Horizon Chart",
		bands: 4,
		positiveColor: "#2166ac",
		negativeColor: "#b2182b",
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.timePoints.length > 0 && props.values.length > 0) {
		return generateHorizonChart(props.timePoints, props.values, {
			title: props.config.title,
			bands: props.config.bands,
			positiveColor: props.config.positiveColor,
			negativeColor: props.config.negativeColor,
		});
	}
	// Sample data
	const sampleTimes = Array.from({ length: 100 }, (_, i) => i);
	const sampleValues = sampleTimes.map((t) => Math.sin(t * 0.1) * 30 + Math.sin(t * 0.03) * 20);
	return generateHorizonChart(sampleTimes, sampleValues, {
		title: props.config.title,
		bands: props.config.bands,
		positiveColor: props.config.positiveColor,
		negativeColor: props.config.negativeColor,
	});
});

const density = computed(() => calculateHorizonDensity(chartData.value));
const peaks = computed(() => findHorizonPeaks(chartData.value, 0.8));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Horizon chart: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-32 relative overflow-hidden">
      <svg viewBox="0 0 100 50" class="w-full h-full" preserveAspectRatio="none">
        <!-- Horizon bands -->
        <g v-for="(series, sIdx) in chartData.series" :key="series.name">
          <path
            v-if="series.data"
            :d="series.data.map((d: {x: number; y: number | number[]}, i: number) => {
              const x = (d.x as number) / (series.data[series.data.length - 1]?.x as number || 1) * 100;
              const yVal = Array.isArray(d.y) ? d.y[1] || 0 : d.y || 0;
              return `${i === 0 ? 'M' : 'L'} ${x},${25 - yVal}`;
            }).join(' ') + ' L 100,25 L 0,25 Z'"
            :fill="series.color || (series.layout?.positive ? config.positiveColor : config.negativeColor)"
            :fill-opacity="series.data[0]?.opacity || 0.8"
          />
        </g>
        
        <!-- Zero line -->
        <line y1="25" y2="25" x1="0" x2="100" stroke="#333" stroke-width="0.5" />
      </svg>
    </div>
    
    <!-- Legend -->
    <div class="flex gap-4 mt-3 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 h-2" :style="{ backgroundColor: config.positiveColor }"></div>
        <span>Positive</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-2" :style="{ backgroundColor: config.negativeColor }"></div>
        <span>Negative</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-2 bg-gray-200"></div>
        <span>Zero</span>
      </div>
    </div>
    
    <!-- Density stats -->
    <div v-if="density" class="mt-3 grid grid-cols-3 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">+Area</div>
        <div class="font-semibold">{{ density.positiveArea.toFixed(0) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">-Area</div>
        <div class="font-semibold">{{ Math.abs(density.negativeArea).toFixed(0) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Peak</div>
        <div class="font-semibold">{{ density.peakDensity.toFixed(2) }}</div>
      </div>
    </div>
    
    <div v-if="peaks.length > 0" class="mt-2 text-xs text-gray-600">
      {{ peaks.length }} significant peaks detected
    </div>
  </div>
</template>
