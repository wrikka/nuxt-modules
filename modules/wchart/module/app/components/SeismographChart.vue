<script setup lang="ts">
import { computed } from "vue";
import { generateSeismographData, calculateSeismicStats, detectWaveArrivals } from "../charts/seismograph";
import type { ChartData } from "../types/chart";

interface Props {
	samples?: number[];
	sampleRate?: number;
	config?: {
		title?: string;
		gain?: number;
		triggerLevel?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	samples: () => [],
	sampleRate: () => 100,
	config: () => ({
		title: "Seismograph",
		gain: 1,
		triggerLevel: 0.5,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.samples.length > 0) {
		return generateSeismographData(props.samples, props.sampleRate, {
			title: props.config.title,
			gain: props.config.gain,
			triggerLevel: props.config.triggerLevel,
		});
	}
	// Sample seismic data
	const sampleData = Array.from({ length: 500 }, (_, i) => {
		const t = i / props.sampleRate;
		// Background noise + event
		const noise = (Math.random() - 0.5) * 0.02;
		const event = t > 2 && t < 5 ? Math.sin(t * 10) * Math.exp(-(t - 2)) * 0.5 : 0;
		return noise + event;
	});
	return generateSeismographData(sampleData, props.sampleRate, {
		title: props.config.title,
		gain: props.config.gain,
		triggerLevel: props.config.triggerLevel,
	});
});

const stats = computed(() => {
	const samples = chartData.value.series[0]?.data.map((d) => d.y as number) || [];
	return calculateSeismicStats(samples, props.sampleRate);
});

const waves = computed(() => {
	const samples = chartData.value.series[0]?.data.map((d) => d.y as number) || [];
	return detectWaveArrivals(samples, props.sampleRate);
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Seismograph: ${chartData.title}`">
    <div class="flex justify-between items-center mb-2">
      <h3 v-if="chartData.title" class="text-lg font-semibold">{{ chartData.title }}</h3>
      <span v-if="waves.magnitude > 0" class="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
        M{{ waves.magnitude.toFixed(1) }}
      </span>
    </div>
    
    <div class="h-32 bg-gray-900 rounded overflow-hidden">
      <svg viewBox="0 0 100 50" class="w-full h-full" preserveAspectRatio="none">
        <!-- Grid -->
        <g stroke="#333" stroke-width="0.2">
          <line y1="25" y2="25" x1="0" x2="100" />
          <line y1="10" y2="10" x1="0" x2="100" stroke-dasharray="2" />
          <line y1="40" y2="40" x1="0" x2="100" stroke-dasharray="2" />
        </g>
        
        <!-- Waveform -->
        <polyline
          v-if="chartData.series[0]?.data"
          :points="chartData.series[0].data.map((d: {x: number; y: number}, i: number) => {
            const x = (i / (chartData.series[0].data.length - 1)) * 100;
            const y = 25 - (d.y as number) * 20;
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#00ff00"
          stroke-width="0.3"
        />
        
        <!-- Trigger level -->
        <line
          y1="15"
          y2="15"
          x1="0"
          x2="100"
          stroke="#ff0000"
          stroke-width="0.2"
          stroke-dasharray="2"
          opacity="0.5"
        />
        <line
          y1="35"
          y2="35"
          x1="0"
          x2="100"
          stroke="#ff0000"
          stroke-width="0.2"
          stroke-dasharray="2"
          opacity="0.5"
        />
      </svg>
    </div>
    
    <!-- Stats -->
    <div class="mt-3 grid grid-cols-4 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Peak</div>
        <div class="font-semibold">{{ (stats.peakAmplitude * 1000).toFixed(2) }}mm</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">RMS</div>
        <div class="font-semibold">{{ (stats.rms * 1000).toFixed(2) }}mm</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Freq</div>
        <div class="font-semibold">{{ stats.dominantFrequency.toFixed(1) }}Hz</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Events</div>
        <div class="font-semibold">{{ stats.events }}</div>
      </div>
    </div>
    
    <!-- Wave arrivals -->
    <div v-if="waves.pWave || waves.sWave" class="mt-2 text-sm text-gray-600">
      <span v-if="waves.pWave">P-wave: {{ waves.pWave.toFixed(1) }}s</span>
      <span v-if="waves.sWave" class="ml-3">S-wave: {{ waves.sWave.toFixed(1) }}s</span>
    </div>
  </div>
</template>
