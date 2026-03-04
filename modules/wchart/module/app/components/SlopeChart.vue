<script setup lang="ts">
import { computed } from "vue";
import { generateSlopeGraph, calculateSlopeStats, rankBySlopeChange } from "../charts/slope-graph";
import type { ChartData } from "../types/chart";

interface Props {
	categories?: string[];
	startValues?: number[];
	endValues?: number[];
	config?: {
		title?: string;
		startLabel?: string;
		endLabel?: string;
		showArrows?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	categories: () => [],
	startValues: () => [],
	endValues: () => [],
	config: () => ({
		title: "Slope Graph",
		startLabel: "Start",
		endLabel: "End",
		showArrows: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.categories.length > 0 && props.startValues.length > 0 && props.endValues.length > 0) {
		return generateSlopeGraph(props.categories, props.startValues, props.endValues, {
			title: props.config.title,
			startLabel: props.config.startLabel,
			endLabel: props.config.endLabel,
			showArrows: props.config.showArrows,
		});
	}
	// Sample data
	const sampleCats = ["Sales", "Revenue", "Profit", "Customers", "Orders"];
	const sampleStart = [100, 80, 60, 120, 90];
	const sampleEnd = [140, 95, 85, 110, 130];
	return generateSlopeGraph(sampleCats, sampleStart, sampleEnd, {
		title: props.config.title,
		startLabel: props.config.startLabel,
		endLabel: props.config.endLabel,
		showArrows: props.config.showArrows,
	});
});

const stats = computed(() => calculateSlopeStats(chartData.value));
const rankings = computed(() => rankBySlopeChange(chartData.value));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Slope graph: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium">{{ config.startLabel }}</span>
      <span class="text-sm font-medium">{{ config.endLabel }}</span>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="(series, idx) in chartData.series"
        :key="series.name"
        class="flex items-center gap-4"
      >
        <!-- Start value -->
        <div class="w-16 text-right font-mono text-sm">
          {{ series.data[0]?.value }}
        </div>
        
        <!-- Slope line -->
        <div class="flex-1 relative h-8">
          <svg viewBox="0 0 100 20" class="w-full h-full" preserveAspectRatio="none">
            <!-- Background bar -->
            <rect
              y="8"
              x="0"
              width="100"
              height="4"
              fill="#eee"
              rx="2"
            />
            <!-- Slope line -->
            <line
              x1="5"
              :y1="10 - ((series.data[0]?.value || 0) / 200 - 0.5) * 15"
              x2="95"
              :y2="10 - ((series.data[1]?.value || 0) / 200 - 0.5) * 15"
              :stroke="series.color || `hsl(${idx * 60}, 70%, 50%)`"
              stroke-width="3"
              stroke-linecap="round"
            />
            <!-- Arrow -->
            <polygon
              v-if="config.showArrows"
              points="90,7 95,10 90,13"
              :fill="series.color || `hsl(${idx * 60}, 70%, 50%)`"
            />
          </svg>
        </div>
        
        <!-- End value -->
        <div class="w-16 text-left font-mono text-sm">
          {{ series.data[1]?.value }}
        </div>
        
        <!-- Change indicator -->
        <div
          class="w-20 text-right text-sm font-medium"
          :class="series.layout?.increasing ? 'text-green-600' : 'text-red-600'"
        >
          {{ series.layout?.increasing ? '+' : '' }}{{ series.layout?.change }}
          ({{ series.layout?.percentChange?.toFixed(0) }}%)
        </div>
      </div>
    </div>
    
    <!-- Summary stats -->
    <div v-if="stats" class="mt-4 grid grid-cols-3 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Net Change</div>
        <div class="font-semibold" :class="stats.netChange > 0 ? 'text-green-600' : 'text-red-600'">
          {{ stats.netChange > 0 ? '+' : '' }}{{ stats.netChange.toFixed(0) }}
        </div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Max Increase</div>
        <div class="font-semibold text-green-600">
          {{ stats.maxIncrease.category }}: +{{ stats.maxIncrease.change }}
        </div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Max Decrease</div>
        <div class="font-semibold text-red-600">
          {{ stats.maxDecrease.category }}: {{ stats.maxDecrease.change }}
        </div>
      </div>
    </div>
  </div>
</template>
