<script setup lang="ts">
import { computed } from "vue";
import { generateSpectrogramData, findSpectrogramPeaks, extractBandEnergy, frequencyBands } from "../charts/spectrogram";
import type { ChartData } from "../types/chart";

interface Props {
	signal?: number[];
	sampleRate?: number;
	config?: {
		title?: string;
		windowSize?: number;
		hopSize?: number;
	};
}

const props = withDefaults(defineProps<Props>(), {
	signal: () => [],
	sampleRate: () => 44100,
	config: () => ({
		title: "Spectrogram",
		windowSize: 256,
		hopSize: 128,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.signal.length > 0) {
		return generateSpectrogramData(props.signal, props.sampleRate, {
			title: props.config.title,
			windowSize: props.config.windowSize,
			hopSize: props.config.hopSize,
		});
	}
	// Sample signal - mix of frequencies
	const sampleSignal: number[] = [];
	for (let i = 0; i < 2048; i++) {
		const t = i / props.sampleRate;
		// Chirp signal
		const f0 = 100;
		const f1 = 1000;
		const freq = f0 + (f1 - f0) * (i / 2048);
		sampleSignal.push(Math.sin(2 * Math.PI * freq * t) * 0.5 + (Math.random() - 0.5) * 0.1);
	}
	return generateSpectrogramData(sampleSignal, props.sampleRate, {
		title: props.config.title,
		windowSize: props.config.windowSize,
		hopSize: props.config.hopSize,
	});
});

const peaks = computed(() => findSpectrogramPeaks(chartData.value, -40));

const bandEnergy = computed(() => {
	const bands = [
		frequencyBands.subBass,
		frequencyBands.bass,
		frequencyBands.lowMid,
		frequencyBands.mid,
		frequencyBands.highMid,
	];
	return extractBandEnergy(chartData.value, bands);
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Spectrogram: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <div class="h-48 bg-gray-900 rounded overflow-hidden">
      <div class="flex h-full">
        <!-- Time axis -->
        <div class="flex-1 relative">
          <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
            <!-- Frequency bands as rectangles -->
            <g v-if="chartData.series">
              <rect
                v-for="(series, sIdx) in chartData.series"
                :key="`frame-${sIdx}`"
                :x="(sIdx / chartData.series.length) * 100"
                y="0"
                :width="100 / chartData.series.length"
                height="100"
                :fill="series.data.length > 0 ? `url(#gradient-${sIdx})` : '#000'"
              />
              
              <!-- Simple frequency visualization -->
              <g v-for="(series, sIdx) in chartData.series" :key="`freqs-${sIdx}`">
                <rect
                  v-for="(point, pIdx) in series.data.slice(0, 20)"
                  :key="`pt-${sIdx}-${pIdx}`"
                  :x="(sIdx / chartData.series.length) * 100"
                  :y="100 - ((pIdx / 20) * 100)"
                  :width="100 / chartData.series.length - 0.5"
                  :height="100 / 20 - 0.5"
                  :fill="point.color || '#000'"
                />
              </g>
            </g>
          </svg>
          
          <!-- Y-axis labels -->
          <div class="absolute left-1 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-2">
            <span>10k</span>
            <span>5k</span>
            <span>1k</span>
            <span>100</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Band energy -->
    <div class="mt-3">
      <div class="text-sm font-medium mb-2">Frequency Bands:</div>
      <div class="space-y-1">
        <div v-for="band in bandEnergy" :key="band.name" class="flex items-center gap-2 text-xs">
          <span class="w-16">{{ band.name }}</span>
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 rounded-full h-2"
              :style="{ width: `${(band.dominance || 0) * 100}%` }"
            ></div>
          </div>
          <span class="w-12 text-right">{{ ((band.dominance || 0) * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>
    
    <!-- Peaks -->
    <div v-if="peaks.length > 0" class="mt-2 text-sm text-gray-600">
      {{ peaks.length }} peaks detected (top: {{ peaks[0]?.frequency.toFixed(0) }}Hz)
    </div>
  </div>
</template>
