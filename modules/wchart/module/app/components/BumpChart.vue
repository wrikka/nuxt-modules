<script setup lang="ts">
import { computed } from "vue";
import { generateBumpChart, calculateRankChanges, findRankCrossings } from "../charts/bump-chart";
import type { ChartData } from "../types/chart";

interface Props {
	categories?: string[];
	timePoints?: string[];
	rankings?: number[][];
	config?: {
		title?: string;
		smooth?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	categories: () => [],
	timePoints: () => [],
	rankings: () => [],
	config: () => ({
		title: "Bump Chart",
		smooth: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.categories.length > 0 && props.timePoints.length > 0 && props.rankings.length > 0) {
		return generateBumpChart(props.categories, props.timePoints, props.rankings, {
			title: props.config.title,
			smooth: props.config.smooth,
		});
	}
	// Sample data
	const sampleCats = ["Product A", "Product B", "Product C", "Product D", "Product E"];
	const sampleTimes = ["Q1", "Q2", "Q3", "Q4"];
	const sampleRankings = [
		[1, 2, 3, 4], // Product A started 1st, ended 4th
		[2, 1, 2, 3], // Product B
		[3, 3, 1, 1], // Product C ended 1st
		[4, 4, 4, 2], // Product D
		[5, 5, 5, 5], // Product E stayed last
	];
	return generateBumpChart(sampleCats, sampleTimes, sampleRankings, {
		title: props.config.title,
		smooth: props.config.smooth,
	});
});

const rankChanges = computed(() => calculateRankChanges(chartData.value));
const crossings = computed(() => findRankCrossings(chartData.value));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Bump chart: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-48 relative">
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Grid lines for ranks -->
        <g stroke="#eee" stroke-width="1">
          <line v-for="i in 5" :key="`grid-${i}`" y1="10" y2="90" :x1="(i - 1) * 25" :x2="(i - 1) * 25" />
          <line v-for="i in 5" :key="`rank-${i}`" x1="0" x2="100" :y1="10 + (i - 1) * 20" :y2="10 + (i - 1) * 20" />
        </g>
        
        <!-- Rank lines -->
        <g v-if="chartData.series">
          <path
            v-for="(series, idx) in chartData.series"
            :key="series.name"
            :d="series.data.length > 0 ? 
              `M ${series.data.map((d: {x: string | number | Date; y: number}, i: number) => {
                const x = (i / (series.data.length - 1)) * 100;
                const y = 10 + ((d.y as number) - 1) * 20;
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')}` : ''"
            fill="none"
            :stroke="series.color || `hsl(${idx * 60}, 70%, 50%)`"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          
          <!-- Rank points -->
          <g v-for="(series, sIdx) in chartData.series" :key="`points-${series.name}`">
            <circle
              v-for="(d, i) in series.data"
              :key="`pt-${sIdx}-${i}`"
              :cx="(i / (series.data.length - 1)) * 100"
              :cy="10 + ((d.y as number) - 1) * 20"
              r="4"
              :fill="series.color || `hsl(${sIdx * 60}, 70%, 50%)`"
              stroke="white"
              stroke-width="2"
            />
          </g>
        </g>
        
        <!-- Crossing indicators -->
        <g v-if="crossings.length > 0">
          <circle
            v-for="(crossing, i) in crossings.slice(0, 5)"
            :key="`cross-${i}`"
            :cx="(crossing.timeIndex / (chartData.series[0]?.data.length - 1 || 1)) * 100"
            cy="50"
            r="3"
            fill="#e15759"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
    
    <!-- Time labels -->
    <div class="flex justify-between text-xs text-gray-600 mt-1 px-4">
      <span v-for="(time, i) in (chartData.series[0]?.data.map((d: {x: string | number | Date}) => d.x) || [])" :key="i">
        {{ time }}
      </span>
    </div>
    
    <!-- Legend with rank changes -->
    <div class="mt-4 space-y-1">
      <div
        v-for="change in rankChanges"
        :key="change.category"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded"
            :style="{ backgroundColor: chartData.series.find((s: {name: string}) => s.name === change.category)?.color || '#ccc' }"
          ></div>
          <span>{{ change.category }}</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-gray-500">#{{ change.startRank }}</span>
          <span :class="change.change > 0 ? 'text-green-600' : change.change < 0 ? 'text-red-600' : 'text-gray-600'">
            {{ change.change > 0 ? '↑' : change.change < 0 ? '↓' : '-' }}{{ Math.abs(change.change) }}
          </span>
          <span class="font-semibold">#{{ change.endRank }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="crossings.length > 0" class="mt-2 text-xs text-gray-600">
      {{ crossings.length }} rank crossings detected
    </div>
  </div>
</template>
