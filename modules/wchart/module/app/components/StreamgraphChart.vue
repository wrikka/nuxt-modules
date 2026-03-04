<script setup lang="ts">
import { computed } from "vue";
import { generateStreamgraphData, calculateStreamgraphVisibility } from "../charts/streamgraph";
import type { ChartData } from "../types/chart";

interface Props {
	categories?: string[];
	layers?: number;
	config?: {
		title?: string;
		smoothness?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	categories: () => [],
	layers: () => 5,
	config: () => ({
		title: "Streamgraph",
		smoothness: 0.5,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.categories.length > 0) {
		return generateStreamgraphData(props.categories, props.layers, {
			title: props.config.title,
			smoothness: props.config.smoothness,
		});
	}
	// Sample data - months
	const sampleCategories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return generateStreamgraphData(sampleCategories, 4, {
		title: props.config.title,
		smoothness: props.config.smoothness,
	});
});

const visibility = computed(() => calculateStreamgraphVisibility(chartData.value));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Streamgraph: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-48">
      <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <g>
          <path
            v-for="(series, idx) in chartData.series"
            :key="series.name"
            :d="series.data.length > 0 ? 
              `M 0,50 ${series.data.map((d: {x: string | number | Date; y: number | number[]}, i: number) => {
                const x = (i / (series.data.length - 1)) * 100;
                const yVal = Array.isArray(d.y) ? d.y[1] : d.y;
                return `L ${x},${50 - (yVal as number) / 2}`;
              }).join(' ')} 
              L 100,50 
              ${series.data.map((d: {x: string | number | Date; y: number | number[]}, i: number) => {
                const idx = series.data.length - 1 - i;
                const d2 = series.data[idx];
                const x = (idx / (series.data.length - 1)) * 100;
                const yVal = Array.isArray(d2.y) ? d2.y[0] : d2.y;
                return `L ${x},${50 - (yVal as number) / 2}`;
              }).join(' ')} Z` : ''"
            :fill="series.color || `hsl(${idx * 60}, 70%, 50%)`"
            fill-opacity="0.8"
            stroke="white"
            stroke-width="0.5"
          />
        </g>
      </svg>
    </div>
    
    <!-- Layer visibility stats -->
    <div v-if="visibility && visibility.length > 0" class="mt-3">
      <div class="text-sm font-medium mb-2">Layer Visibility:</div>
      <div class="space-y-1 text-xs">
        <div
          v-for="layer in visibility"
          :key="layer.layer"
          class="flex items-center gap-2"
        >
          <div class="w-3 h-3 rounded" :style="{ backgroundColor: chartData.series.find(s => s.name === layer.layer)?.color || '#ccc' }"></div>
          <span class="w-24 truncate">{{ layer.layer }}</span>
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div
              class="bg-gray-600 rounded-full h-2"
              :style="{ width: `${(layer.dominance || 0) * 100}%` }"
            ></div>
          </div>
          <span class="w-12 text-right">{{ ((layer.dominance || 0) * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
