<script setup lang="ts">
import { computed } from "vue";
import { generateECGData, detectECGFeatures, calculateHeartRate, type ECGLead } from "../charts/ecg";
import type { ChartData } from "../types/chart";

interface Props {
	samples?: number[];
	sampleRate?: number;
	config?: {
		title?: string;
		gain?: number;
		leadName?: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	samples: () => [],
	sampleRate: () => 500,
	config: () => ({
		title: "ECG Monitor",
		gain: 1,
		leadName: "Lead II",
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.samples.length > 0) {
		return generateECGData(props.samples, props.sampleRate, {
			title: props.config.title,
			gain: props.config.gain,
			leadName: props.config.leadName,
		});
	}
	// Sample ECG data (2 seconds, 60 bpm)
	const numSamples = props.sampleRate * 2;
	const samples: number[] = [];
	const samplesPerBeat = props.sampleRate;
	
	for (let i = 0; i < numSamples; i++) {
		const t = (i % samplesPerBeat) / props.sampleRate;
		let value = (Math.random() - 0.5) * 0.02;
		
		// P wave
		if (t > 0.1 && t < 0.2) value += 0.1 * Math.sin(Math.PI * (t - 0.1) / 0.1);
		// QRS
		if (t > 0.3 && t < 0.4) {
			if (t < 0.33) value -= 0.1;
			else if (t < 0.36) value += 1.0;
			else value -= 0.2;
		}
		// T wave
		if (t > 0.5 && t < 0.7) value += 0.2 * Math.sin(Math.PI * (t - 0.5) / 0.2);
		
		samples.push(value);
	}
	
	return generateECGData(samples, props.sampleRate, {
		title: props.config.title,
		gain: props.config.gain,
		leadName: props.config.leadName,
	});
});

const features = computed(() => {
	const samples = chartData.value.series[0]?.data.map((d) => d.y as number) || [];
	return detectECGFeatures(samples, props.sampleRate);
});

const heartRate = computed(() => calculateHeartRate(features.value, props.sampleRate));
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`ECG: ${chartData.title}`">
    <div class="flex justify-between items-center mb-2">
      <div>
        <h3 v-if="chartData.title" class="text-lg font-semibold">{{ chartData.title }}</h3>
        <div class="text-sm text-gray-600">{{ config.leadName }}</div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-red-600">{{ heartRate.bpm.toFixed(0) }}</div>
        <div class="text-xs text-gray-500">BPM</div>
      </div>
    </div>
    
    <div class="h-32 bg-gray-900 rounded overflow-hidden relative">
      <!-- Grid background -->
      <div class="absolute inset-0 opacity-20" 
        style="background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 10px 10px;">
      </div>
      
      <svg viewBox="0 0 100 50" class="w-full h-full" preserveAspectRatio="none">
        <!-- ECG trace -->
        <polyline
          v-if="chartData.series[0]?.data"
          :points="chartData.series[0].data.map((d: {x: number; y: number}, i: number) => {
            const x = (i / (chartData.series[0].data.length - 1)) * 100;
            const y = 25 - (d.y as number) * 10;
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#00ff00"
          stroke-width="0.5"
        />
        
        <!-- R peak markers -->
        <circle
          v-for="feature in features.filter((f) => f.type === 'R').slice(0, 5)"
          :key="`r-${feature.index}`"
          :cx="(feature.index / (chartData.series[0]?.data.length || 1)) * 100"
          :cy="25 - feature.amplitude * 10"
          r="1"
          fill="red"
        />
      </svg>
    </div>
    
    <!-- Stats -->
    <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">R-R Interval</div>
        <div class="font-semibold" v-if="heartRate.intervals.length > 0">
          {{ (heartRate.intervals[0] * 1000).toFixed(0) }}ms
        </div>
        <div class="font-semibold" v-else>--</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">HRV</div>
        <div class="font-semibold">{{ (heartRate.variability * 1000).toFixed(1) }}ms</div>
      </div>
      <div class="bg-gray-100 p-2 rounded text-center">
        <div class="text-gray-600">Beats</div>
        <div class="font-semibold">{{ features.filter((f) => f.type === 'R').length }}</div>
      </div>
    </div>
  </div>
</template>
