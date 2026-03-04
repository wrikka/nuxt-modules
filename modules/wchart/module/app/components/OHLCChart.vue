<script setup lang="ts">
import { computed } from "vue";
import { generateOHLCData, detectCandlestickPatterns, calculateBollingerBands, type OHLCCandle } from "../charts/ohlc";
import type { ChartData } from "../types/chart";

interface Props {
	candles?: OHLCCandle[];
	config?: {
		title?: string;
		showPatterns?: boolean;
		showBollinger?: boolean;
		colorUp?: string;
		colorDown?: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	candles: () => [],
	config: () => ({
		title: "OHLC Chart",
		showPatterns: false,
		showBollinger: false,
		colorUp: "#26a69a",
		colorDown: "#ef5350",
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.candles.length > 0) {
		return generateOHLCData(props.candles, {
			title: props.config.title,
			colorUp: props.config.colorUp,
			colorDown: props.config.colorDown,
		});
	}
	// Sample data
	const sampleCandles: OHLCCandle[] = Array.from({ length: 30 }, (_, i) => {
		const base = 100 + Math.sin(i * 0.3) * 10;
		const open = base + (Math.random() - 0.5) * 5;
		const close = open + (Math.random() - 0.5) * 8;
		const high = Math.max(open, close) + Math.random() * 3;
		const low = Math.min(open, close) - Math.random() * 3;
		return {
			date: new Date(Date.now() - (30 - i) * 86400000),
			open,
			high,
			low,
			close,
		};
	});
	return generateOHLCData(sampleCandles, {
		title: props.config.title,
		colorUp: props.config.colorUp,
		colorDown: props.config.colorDown,
	});
});

const patterns = computed(() => {
	if (!props.config.showPatterns || props.candles.length === 0) return [];
	return detectCandlestickPatterns(props.candles);
});

const bollingerBands = computed(() => {
	if (!props.config.showBollinger || props.candles.length === 0) return [];
	return calculateBollingerBands(props.candles);
});

const emit = defineEmits<{
	candleClick: [candle: OHLCCandle];
}>();
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`OHLC chart: ${chartData.title}`">
    <div class="flex justify-between items-center mb-2">
      <h3 v-if="chartData.title" class="text-lg font-semibold">{{ chartData.title }}</h3>
      <div v-if="patterns.length > 0" class="text-sm text-gray-600">
        {{ patterns.length }} patterns detected
      </div>
    </div>
    <div class="min-h-64 flex items-center justify-center bg-gray-50">
      <!-- Candlestick rendering -->
      <div class="flex items-end gap-1 h-48 px-4">
        <div
          v-for="(candle, i) in chartData.series[0]?.data || []"
          :key="i"
          class="relative w-3 cursor-pointer hover:opacity-80"
          @click="emit('candleClick', candle.ohlc)"
        >
          <!-- Wick -->
          <div
            class="absolute left-1/2 w-px -translate-x-1/2"
            :class="candle.color === config.colorUp ? 'bg-green-600' : 'bg-red-600'"
            :style="{
              top: `${50 - (candle.ohlc?.high - candle.ohlc?.low) * 2}%`,
              height: `${(candle.ohlc?.high - candle.ohlc?.low) * 4}%`
            }"
          />
          <!-- Body -->
          <div
            class="absolute left-0 right-0 rounded-sm"
            :class="candle.color === config.colorUp ? 'bg-green-500' : 'bg-red-500'"
            :style="{
              top: `${50 - Math.max(candle.ohlc?.open, candle.ohlc?.close) * 2}%`,
              height: `${Math.abs(candle.ohlc?.close - candle.ohlc?.open) * 4}%`
            }"
          />
        </div>
      </div>
    </div>
    <div v-if="patterns.length > 0" class="mt-2 text-sm">
      <div class="font-medium">Detected Patterns:</div>
      <div class="flex flex-wrap gap-2 mt-1">
        <span
          v-for="pattern in patterns.slice(0, 5)"
          :key="pattern.index"
          class="px-2 py-1 bg-yellow-100 rounded text-xs"
        >
          {{ pattern.pattern }} at #{{ pattern.index }}
        </span>
      </div>
    </div>
  </div>
</template>
