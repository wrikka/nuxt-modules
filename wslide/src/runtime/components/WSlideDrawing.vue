<script setup lang="ts">
import { useDrawing } from "../../composables/useDrawing";

const drawing = useDrawing();

const props = defineProps<{
	slideId: string;
}>();

function handleMouseDown(event: MouseEvent) {
	drawing.startStroke(props.slideId, event.clientX, event.clientY);
}

function handleMouseMove(event: MouseEvent) {
	drawing.addPoint(event.clientX, event.clientY);
}

function handleMouseUp() {
	drawing.endStroke();
}

const slideDrawings = computed(() => drawing.getDrawingsForSlide(props.slideId));
</script>

<template>
	<div
		v-if="drawing.isDrawing.value"
		class="fixed inset-0 z-50 cursor-crosshair"
		@mousedown="handleMouseDown"
		@mousemove="handleMouseMove"
		@mouseup="handleMouseUp"
		@mouseleave="handleMouseUp"
	/>

	<svg class="absolute inset-0 pointer-events-none z-40" width="100%" height="100%">
		<g v-for="(stroke, index) in slideDrawings" :key="index">
			<path
				v-if="stroke.points.length > 1"
				:stroke="stroke.color"
				:stroke-width="stroke.width"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				opacity="0.8"
				:d="`M ${stroke.points.map(p => `${p.x} ${p.y}`).join(' L ')}`"
			/>
		</g>
	</svg>
</template>
