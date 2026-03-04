<script setup lang="ts">
import { computed } from "vue";
import { generate3DScatterData, calculate3DBoundingBox, type DataPoint } from "../charts/scatter3d";
import type { ChartData } from "../types/chart";

interface Props {
	points?: Array<{
		x: number;
		y: number;
		z: number;
		size?: number;
		color?: string;
		label?: string;
	}>;
	config?: {
		title?: string;
		rotation?: { x: number; y: number; z: number };
		perspective?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	points: () => [],
	config: () => ({
		title: "3D Scatter Plot",
		rotation: { x: 0.3, y: 0.5, z: 0 },
		perspective: 0.5,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.points.length > 0) {
		return generate3DScatterData(props.points, {
			title: props.config.title,
			rotation: props.config.rotation,
			perspective: props.config.perspective,
		});
	}
	// Sample 3D data
	const samplePoints = Array.from({ length: 50 }, () => ({
		x: (Math.random() - 0.5) * 100,
		y: (Math.random() - 0.5) * 100,
		z: (Math.random() - 0.5) * 100,
		size: 5 + Math.random() * 10,
		color: `hsl(${Math.random() * 360}, 70%, 50%)`,
	}));
	return generate3DScatterData(samplePoints, {
		title: props.config.title,
		rotation: props.config.rotation,
	});
});

const bounds = computed(() => {
	const points = chartData.value.series[0]?.data || [];
	return calculate3DBoundingBox(
		points.map((p: DataPoint) => ({ x: p.x as number, y: p.y as number, z: (p.z as number) || 0 }))
	);
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`3D scatter plot: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="relative h-64 bg-gray-50 overflow-hidden">
      <svg viewBox="-100 -100 200 200" class="w-full h-full">
        <!-- Grid lines -->
        <g stroke="#ddd" stroke-width="0.5">
          <line x1="-80" y1="0" x2="80" y2="0" />
          <line x1="0" y1="-80" x2="0" y2="80" />
        </g>
        
        <!-- 3D Points -->
        <g>
          <circle
            v-for="(point, i) in chartData.series[0]?.data || []"
            :key="i"
            :cx="point.x"
            :cy="point.y"
            :r="point.size || 4"
            :fill="point.color || '#4e79a7'"
            :opacity="0.6 + ((point.z as number) || 0) / 200"
            class="hover:stroke-2 hover:stroke-gray-800 cursor-pointer"
          />
        </g>
        
        <!-- Axes labels -->
        <text x="85" y="5" class="text-xs fill-gray-600">X</text>
        <text x="5" y="-85" class="text-xs fill-gray-600">Y</text>
      </svg>
    </div>
    
    <div v-if="bounds" class="mt-2 text-xs text-gray-600 grid grid-cols-3 gap-2">
      <div>X: {{ bounds.min.x.toFixed(1) }} to {{ bounds.max.x.toFixed(1) }}</div>
      <div>Y: {{ bounds.min.y.toFixed(1) }} to {{ bounds.max.y.toFixed(1) }}</div>
      <div>Z: {{ bounds.min.z.toFixed(1) }} to {{ bounds.max.z.toFixed(1) }}</div>
    </div>
  </div>
</template>
