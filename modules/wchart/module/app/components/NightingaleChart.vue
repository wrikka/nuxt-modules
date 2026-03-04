<script setup lang="ts">
import { computed } from "vue";
import { generateNightingaleData, calculateNightingaleStats, type ChartData } from "../charts/nightingale";

interface Props {
	categories?: string[];
	values?: number[];
	config?: {
		title?: string;
		maxRadius?: number;
		clockwise?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	categories: () => [],
	values: () => [],
	config: () => ({
		title: "Nightingale Rose",
		maxRadius: 100,
		clockwise: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.categories.length > 0 && props.values.length > 0) {
		return generateNightingaleData(props.categories, props.values, {
			title: props.config.title,
			maxRadius: props.config.maxRadius,
			clockwise: props.config.clockwise,
		});
	}
	// Sample data
	const sampleCats = ["North", "N-East", "East", "S-East", "South", "S-West", "West", "N-West"];
	const sampleVals = [30, 45, 60, 35, 50, 40, 55, 25];
	return generateNightingaleData(sampleCats, sampleVals, {
		title: props.config.title,
		maxRadius: props.config.maxRadius,
		clockwise: props.config.clockwise,
	});
});

const stats = computed(() => calculateNightingaleStats(chartData.value));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Nightingale rose: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-48 flex items-center justify-center">
      <svg viewBox="-120 -120 240 240" class="w-full h-full max-w-48">
        <!-- Background circles -->
        <circle cx="0" cy="0" r="20" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#eee" stroke-width="1" />
        <circle cx="0" cy="0" r="80" fill="none" stroke="#eee" stroke-width="1" />
        
        <!-- Petals -->
        <g v-if="chartData.series[0]?.data">
          <path
            v-for="(d, i) in chartData.series[0].data"
            :key="i"
            :d="(() => {
              const angleStep = (Math.PI * 2) / chartData.series[0].data.length;
              const startAngle = d.startAngle || (angleStep * i);
              const endAngle = d.endAngle || (angleStep * (i + 1));
              const r = (d.radius as number) || (d.y as number) * 1.5;
              const x1 = Math.cos(startAngle) * r;
              const y1 = Math.sin(startAngle) * r;
              const x2 = Math.cos(endAngle) * r;
              const y2 = Math.sin(endAngle) * y1;
              return `M 0,0 L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;
            })()"
            :fill="d.color || `hsl(${i * 45}, 70%, 50%)`"
            fill-opacity="0.7"
            stroke="white"
            stroke-width="1"
          />
        </g>
        
        <!-- Center -->
        <circle cx="0" cy="0" r="3" fill="#333" />
        
        <!-- Labels -->
        <text
          v-for="(d, i) in chartData.series[0]?.data || []"
          :key="`label-${i}`"
          :x="Math.cos((d.angle || 0) + Math.PI / chartData.series[0].data.length) * ((d.radius || 0) + 15)"
          :y="Math.sin((d.angle || 0) + Math.PI / chartData.series[0].data.length) * ((d.radius || 0) + 15)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-xs fill-gray-700"
          font-size="10"
        >
          {{ d.x }}
        </text>
      </svg>
    </div>
    
    <!-- Stats -->
    <div v-if="stats" class="mt-3 grid grid-cols-2 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Total</div>
        <div class="font-semibold">{{ stats.total.toFixed(1) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Average</div>
        <div class="font-semibold">{{ stats.average.toFixed(1) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Max</div>
        <div class="font-semibold">{{ stats.maxPetal.category }}: {{ stats.maxPetal.value }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Balance</div>
        <div class="font-semibold">{{ (stats.balanceScore * 100).toFixed(0) }}%</div>
      </div>
    </div>
  </div>
</template>
