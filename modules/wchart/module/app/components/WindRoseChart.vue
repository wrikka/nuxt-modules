<script setup lang="ts">
import { computed } from "vue";
import { generateWindRoseData, calculateWindStats } from "../charts/wind-rose";
import type { ChartData } from "../types/chart";

interface Props {
	directions?: number[];
	speeds?: number[];
	config?: {
		title?: string;
		numDirections?: number;
		speedBands?: number[];
	};
}

const props = withDefaults(defineProps<Props>(), {
	directions: () => [],
	speeds: () => [],
	config: () => ({
		title: "Wind Rose",
		numDirections: 16,
		speedBands: [5, 10, 15, 20],
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.directions.length > 0 && props.speeds.length > 0) {
		return generateWindRoseData(props.directions, props.speeds, {
			title: props.config.title,
			numDirections: props.config.numDirections,
			speedBands: props.config.speedBands,
		});
	}
	// Sample wind data
	const sampleDirs = Array.from({ length: 200 }, () => Math.random() * 360);
	const sampleSpeeds = Array.from({ length: 200 }, () => Math.random() * 25);
	return generateWindRoseData(sampleDirs, sampleSpeeds, {
		title: props.config.title,
		numDirections: props.config.numDirections,
		speedBands: props.config.speedBands,
	});
});

const stats = computed(() => calculateWindStats(props.directions, props.speeds));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Wind rose: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="flex items-center justify-center">
      <svg viewBox="-120 -120 240 240" class="w-48 h-48">
        <!-- Background circles -->
        <circle cx="0" cy="0" r="20" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="80" fill="none" stroke="#eee" stroke-width="1" />
        
        <!-- Direction labels -->
        <text x="0" y="-100" text-anchor="middle" class="text-xs fill-gray-600" font-size="10">N</text>
        <text x="100" y="5" text-anchor="middle" class="text-xs fill-gray-600" font-size="10">E</text>
        <text x="0" y="105" text-anchor="middle" class="text-xs fill-gray-600" font-size="10">S</text>
        <text x="-100" y="5" text-anchor="middle" class="text-xs fill-gray-600" font-size="10">W</text>
        
        <!-- Wind sectors -->
        <g v-if="chartData.series">
          <path
            v-for="(series, sIdx) in chartData.series.filter((s: {name: string}) => s.name !== 'Calm')"
            :key="series.name"
            :d="series.data.map((d: {x: number; y: number}, i: number) => {
              const angleStep = (Math.PI * 2) / props.config.numDirections;
              const startAngle = d.x * Math.PI / 180;
              const endAngle = startAngle + angleStep;
              const prevRadius = sIdx > 0 ? 
                (chartData.series[sIdx - 1].data[i]?.y || 0) : 0;
              const r = (d.y as number) + prevRadius;
              const x1 = Math.cos(startAngle) * prevRadius;
              const y1 = Math.sin(startAngle) * prevRadius;
              const x2 = Math.cos(startAngle) * r;
              const y2 = Math.sin(startAngle) * r;
              const x3 = Math.cos(endAngle) * r;
              const y3 = Math.sin(endAngle) * r;
              const x4 = Math.cos(endAngle) * prevRadius;
              const y4 = Math.sin(endAngle) * prevRadius;
              return `M ${x1},${y1} L ${x2},${y2} A ${r},${r} 0 0,1 ${x3},${y3} L ${x4},${y4} A ${prevRadius},${prevRadius} 0 0,0 ${x1},${y1} Z`;
            }).join(' ')"
            :fill="series.color || `hsl(${sIdx * 60}, 70%, 50%)`"
            fill-opacity="0.7"
            stroke="white"
            stroke-width="0.5"
          />
        </g>
        
        <!-- Center calm circle -->
        <circle cx="0" cy="0" r="5" fill="#ccc" />
      </svg>
    </div>
    
    <!-- Legend -->
    <div class="mt-4 flex flex-wrap justify-center gap-3 text-xs">
      <div v-for="series in chartData.series" :key="series.name" class="flex items-center gap-1">
        <div class="w-3 h-3 rounded" :style="{ backgroundColor: series.color }"></div>
        <span>{{ series.name }}</span>
      </div>
    </div>
    
    <!-- Stats -->
    <div v-if="stats" class="mt-4 grid grid-cols-2 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Prevailing</div>
        <div class="font-semibold">{{ stats.prevailingDirection.toFixed(0) }}°</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Avg Speed</div>
        <div class="font-semibold">{{ stats.avgSpeed.toFixed(1) }} knots</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Max Speed</div>
        <div class="font-semibold">{{ stats.maxSpeed.toFixed(1) }} knots</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Calm</div>
        <div class="font-semibold">{{ stats.calmPercentage.toFixed(1) }}%</div>
      </div>
    </div>
  </div>
</template>
