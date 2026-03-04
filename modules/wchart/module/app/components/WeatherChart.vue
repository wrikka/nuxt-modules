<script setup lang="ts">
import { computed } from "vue";
import { generateWeatherData, calculateWeatherStats, type WeatherConfig } from "../charts/weather";
import type { ChartData } from "../types/chart";

interface Props {
	times?: Date[];
	temperature?: number[];
	humidity?: number[];
	pressure?: number[];
	windSpeed?: number[];
	precipitation?: number[];
	config?: {
		title?: string;
		showArea?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	times: () => [],
	temperature: () => [],
	humidity: () => [],
	pressure: () => [],
	windSpeed: () => [],
	precipitation: () => [],
	config: () => ({
		title: "Weather Station",
		showArea: true,
	}),
});

const chartData = computed<ChartData>(() => {
	if (props.times.length > 0 && props.temperature.length > 0) {
		return generateWeatherData(
			props.times,
			props.temperature,
			props.humidity,
			props.pressure,
			props.windSpeed,
			props.precipitation,
			{ title: props.config.title, showArea: props.config.showArea }
		);
	}
	// Sample weather data (24 hours)
	const now = new Date();
	const sampleTimes = Array.from({ length: 24 }, (_, i) => new Date(now.getTime() - (23 - i) * 3600000));
	const sampleTemp = sampleTimes.map((_, i) => 20 + Math.sin((i - 12) * Math.PI / 12) * 8 + Math.random() * 2);
	const sampleHumidity = sampleTimes.map(() => 60 + Math.random() * 30);
	const samplePressure = sampleTimes.map(() => 1013 + Math.random() * 20);
	const sampleWind = sampleTimes.map(() => Math.random() * 25);
	const sampleRain = sampleTimes.map((_, i) => i > 18 && i < 22 ? Math.random() * 5 : 0);
	
	return generateWeatherData(
		sampleTimes,
		sampleTemp,
		sampleHumidity,
		samplePressure,
		sampleWind,
		sampleRain,
		{ title: props.config.title, showArea: props.config.showArea }
	);
});

const weatherStats = computed(() => {
	if (props.temperature.length === 0) return null;
	return calculateWeatherStats(
		props.temperature,
		props.humidity,
		props.pressure,
		props.windSpeed
	);
});
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg" role="img" :aria-label="`Weather chart: ${chartData.title}`">
    <h3 v-if="chartData.title" class="text-lg font-semibold mb-4">{{ chartData.title }}</h3>
    
    <!-- Multi-metric chart -->
    <div class="h-48 mb-4 relative">
      <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <!-- Temperature line -->
        <polyline
          v-if="chartData.series[0]?.data"
          :points="chartData.series[0].data.map((d: {x: string | number | Date; y: number}, i: number) => {
            const x = (i / (chartData.series[0].data.length - 1)) * 100;
            const y = 100 - ((d.y as number) / 50 * 100);
            return `${x},${y}`;
          }).join(' ')"
          fill="none"
          stroke="#ff6384"
          stroke-width="2"
        />
        <!-- Humidity area -->
        <path
          v-if="chartData.series[1]?.data"
          :d="`M 0,100 ${chartData.series[1].data.map((d: {x: string | number | Date; y: number}, i: number) => {
            const x = (i / (chartData.series[1].data.length - 1)) * 100;
            const y = 100 - ((d.y as number) / 100 * 100);
            return `L ${x},${y}`;
          }).join(' ')} L 100,100 Z`"
          fill="#36a2eb"
          fill-opacity="0.3"
        />
        <!-- Wind bars -->
        <g v-if="chartData.series[3]?.data">
          <rect
            v-for="(d, i) in chartData.series[3].data"
            :key="`wind-${i}`"
            :x="(i / chartData.series[3].data.length) * 100"
            :y="100 - ((d.y as number) / 50 * 100)"
            :width="80 / chartData.series[3].data.length"
            :height="(d.y as number) / 50 * 100"
            fill="#4bc0c0"
            fill-opacity="0.5"
          />
        </g>
      </svg>
    </div>
    
    <!-- Stats cards -->
    <div v-if="weatherStats" class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Temperature</div>
        <div class="font-semibold">{{ weatherStats.temp.avg.toFixed(1) }}°C</div>
        <div class="text-xs text-gray-500">{{ weatherStats.temp.min.toFixed(1) }} - {{ weatherStats.temp.max.toFixed(1) }}</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Humidity</div>
        <div class="font-semibold">{{ weatherStats.humidity.avg.toFixed(0) }}%</div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Pressure</div>
        <div class="font-semibold" :class="weatherStats.pressure.trend === 'rising' ? 'text-green-600' : weatherStats.pressure.trend === 'falling' ? 'text-red-600' : ''">
          {{ weatherStats.pressure.trend === 'rising' ? '↑' : weatherStats.pressure.trend === 'falling' ? '↓' : '→' }}
        </div>
      </div>
      <div class="bg-gray-100 p-2 rounded">
        <div class="text-gray-600">Wind</div>
        <div class="font-semibold">{{ weatherStats.wind.avg.toFixed(1) }} km/h</div>
        <div class="text-xs text-gray-500">Max: {{ weatherStats.wind.max.toFixed(1) }}</div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="flex flex-wrap gap-4 mt-3 text-sm">
      <div v-for="series in chartData.series.slice(0, 4)" :key="series.name" class="flex items-center gap-1">
        <div class="w-3 h-3 rounded" :style="{ backgroundColor: series.color }"></div>
        <span>{{ series.name }}</span>
      </div>
    </div>
  </div>
</template>
