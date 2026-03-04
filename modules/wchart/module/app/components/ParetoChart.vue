<script setup lang="ts">
import { computed } from "vue";
import { generateParetoData, identifyVitalFew, calculateParetoMetrics } from "../charts/pareto-chart";
import type { ChartData } from "../types/chart";

interface Props {
	categories?: string[];
	values?: number[];
	config?: {
		title?: string;
		threshold?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	categories: () => [],
	values: () => [],
	config: () => ({
		title: "Pareto Analysis",
		threshold: 80,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.categories.length > 0 && props.values.length > 0) {
		return generateParetoData(props.categories, props.values, {
			title: props.config.title,
			threshold: props.config.threshold,
		});
	}
	// Sample data
	const sampleCats = ["Defect A", "Defect B", "Defect C", "Defect D", "Defect E", "Defect F", "Defect G"];
	const sampleVals = [45, 25, 15, 8, 4, 2, 1];
	return generateParetoData(sampleCats, sampleVals, {
		title: props.config.title,
		threshold: props.config.threshold,
	});
});

const vitalFew = computed(() => identifyVitalFew(chartData.value, props.config.threshold));

const metrics = computed(() => {
	if (props.categories.length === 0) return null;
	return calculateParetoMetrics(props.categories, props.values);
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Pareto chart: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-48 relative">
      <!-- Combined bar and line chart -->
      <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <!-- Bars -->
        <g v-if="chartData.series[0]?.data">
          <rect
            v-for="(d, i) in chartData.series[0].data"
            :key="`bar-${i}`"
            :x="i * (100 / chartData.series[0].data.length) + 2"
            :y="100 - ((d.y as number) / 50 * 100)"
            :width="(100 / chartData.series[0].data.length) - 4"
            :height="(d.y as number) / 50 * 100"
            :fill="chartData.series[0].color || '#4e79a7'"
          />
        </g>
        <!-- Cumulative line -->
        <polyline
          v-if="chartData.series[1]?.data"
          :points="chartData.series[1].data.map((d: {x: number; y: number}, i: number) => {
            const x = (i + 0.5) * (100 / chartData.series[1].data.length);
            const y = 100 - (d.y as number);
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#e15759"
          stroke-width="2"
        />
        <!-- 80% threshold -->
        <line
          y1="20"
          y2="20"
          x1="0"
          x2="100"
          stroke="#59a14f"
          stroke-width="1"
          stroke-dasharray="4"
        />
      </svg>
    </div>
    
    <!-- 80/20 Analysis -->
    <div v-if="vitalFew.cutoffIndex > 0" class="mt-3 p-3 bg-yellow-50 rounded text-sm">
      <div class="font-medium text-yellow-800">80/20 Rule Analysis:</div>
      <div class="text-yellow-700">
        Top {{ vitalFew.cutoffIndex + 1 }} categories ({{ ((vitalFew.cutoffIndex + 1) / (chartData.series[0]?.data.length || 1) * 100).toFixed(0) }}%) 
        account for ~80% of the total
      </div>
      <div class="mt-1 text-xs text-gray-600">
        Vital Few: {{ vitalFew.vitalFew.slice(0, 3).join(", ") }}{{ vitalFew.vitalFew.length > 3 ? "..." : "" }}
      </div>
    </div>
    
    <!-- Metrics -->
    <div v-if="metrics" class="mt-3 grid grid-cols-3 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Gini</div>
        <div class="font-semibold">{{ metrics.giniCoefficient.toFixed(3) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Concentration</div>
        <div class="font-semibold">{{ metrics.concentration.toFixed(3) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Top Item</div>
        <div class="font-semibold">{{ metrics.topN[0]?.category || "-" }}</div>
      </div>
    </div>
  </div>
</template>
