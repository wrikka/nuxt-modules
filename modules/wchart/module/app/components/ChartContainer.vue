<template>
  <div class="border border-gray-200 rounded-lg bg-white overflow-hidden" role="region" :aria-label="title ? `${title} Chart Container` : 'Chart Container'">
    <div v-if="title" class="p-4 border-b border-gray-200">
      <h3 class="m-0 text-xl font-semibold text-gray-900" id="chart-title">{{ title }}</h3>
    </div>

    <div class="relative flex items-center justify-center" :style="{ height: height }" aria-live="polite">
      <div v-if="loading" class="flex flex-col items-center gap-4 text-gray-600" role="status" aria-label="Loading chart data">
        <Icon name="lucide:loader" class="w-8 h-8 text-blue-500 animate-spin" aria-hidden="true" />
        <p>Loading chart...</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center gap-4 text-gray-600" role="alert" aria-live="assertive">
        <Icon name="lucide:alert-triangle" class="w-8 h-8 text-red-500" aria-hidden="true" />
        <p class="text-center max-w-xs">{{ error }}</p>
        <button @click="emit('retry')" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border-none rounded hover:bg-blue-700 cursor-pointer text-sm" aria-label="Retry loading chart">
          <Icon name="lucide:rotate-ccw" aria-hidden="true" />
          Retry
        </button>
      </div>

      <div v-else class="w-full h-full relative overflow-hidden" role="img" :aria-labelledby="title ? 'chart-title' : undefined" :aria-label="title ? undefined : 'Interactive chart'">
        <div v-if="enableZoomPan" class="absolute top-2 right-2 z-10 flex flex-col gap-1" role="toolbar" aria-label="Chart zoom and pan controls">
          <button @click="handleZoomIn" @keydown.enter="handleZoomIn" @keydown.space.prevent="handleZoomIn" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center text-sm font-bold" title="Zoom In" aria-label="Zoom in chart">+</button>
          <button @click="handleZoomOut" @keydown.enter="handleZoomOut" @keydown.space.prevent="handleZoomOut" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center text-sm font-bold" title="Zoom Out" aria-label="Zoom out chart">−</button>
          <div class="flex gap-1">
            <button @click="handlePan('up')" @keydown.enter="handlePan('up')" @keydown.space.prevent="handlePan('up')" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center" title="Pan Up" aria-label="Pan chart up">↑</button>
          </div>
          <div class="flex gap-1">
            <button @click="handlePan('left')" @keydown.enter="handlePan('left')" @keydown.space.prevent="handlePan('left')" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center" title="Pan Left" aria-label="Pan chart left">←</button>
            <button @click="handlePan('down')" @keydown.enter="handlePan('down')" @keydown.space.prevent="handlePan('down')" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center" title="Pan Down" aria-label="Pan chart down">↓</button>
            <button @click="handlePan('right')" @keydown.enter="handlePan('right')" @keydown.space.prevent="handlePan('right')" class="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center" title="Pan Right" aria-label="Pan chart right">→</button>
          </div>
        </div>
        <div class="w-full h-full" :style="{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, transformOrigin: 'center' }" tabindex="0" @keydown="handleChartKeydown">
          <slot />
          <Annotation v-if="annotations.length > 0" :annotations="annotations" :width="400" :height="300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Annotation from "./Annotation.vue";
interface Props {
	loading?: boolean;
	error?: string | null;
	height?: string;
	title?: string;
	enableZoomPan?: boolean;
	zoom?: number;
	panX?: number;
	panY?: number;
	annotations?: Array<{
		id: string;
		type: "marker" | "line" | "area" | "text";
		position: { x: number; y: number };
		text?: string;
		color?: string;
		size?: number;
		style?: "solid" | "dashed" | "dotted";
	}>;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	error: null,
	height: "400px",
	enableZoomPan: false,
	zoom: 1,
	panX: 0,
	panY: 0,
	annotations: () => [],
});

const emit = defineEmits<{
	retry: [];
	zoom: [zoom: number];
	pan: [panX: number, panY: number];
}>();

const handleZoomIn = () => {
	emit("zoom", props.zoom * 1.2);
};

const handleZoomOut = () => {
	emit("zoom", props.zoom / 1.2);
};

const handlePan = (direction: "left" | "right" | "up" | "down") => {
	const step = 50;
	let newPanX = props.panX;
	let newPanY = props.panY;

	switch (direction) {
		case "left":
			newPanX -= step;
			break;
		case "right":
			newPanX += step;
			break;
		case "up":
			newPanY -= step;
			break;
		case "down":
			newPanY += step;
			break;
	}

	emit("pan", newPanX, newPanY);
};

const handleChartKeydown = (event: KeyboardEvent) => {
	if (!props.enableZoomPan) return;

	switch (event.key) {
		case "+":
		case "=":
			event.preventDefault();
			handleZoomIn();
			break;
		case "-":
			event.preventDefault();
			handleZoomOut();
			break;
		case "ArrowUp":
			event.preventDefault();
			handlePan("up");
			break;
		case "ArrowDown":
			event.preventDefault();
			handlePan("down");
			break;
		case "ArrowLeft":
			event.preventDefault();
			handlePan("left");
			break;
		case "ArrowRight":
			event.preventDefault();
			handlePan("right");
			break;
	}
};
</script>
