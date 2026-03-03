<script setup lang="ts">
import { useZoom } from "../composables/useZoom";

const zoom = useZoom();
</script>

<template>
	<div class="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg">
		<button
			class="p-1.5 hover:bg-white/20 rounded transition-colors"
			@click="zoom.zoomOut()"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14" />
			</svg>
		</button>
		<span class="text-sm font-medium min-w-[60px] text-center">{{ Math.round(zoom.zoomLevel.value * 100) }}%</span>
		<button
			class="p-1.5 hover:bg-white/20 rounded transition-colors"
			@click="zoom.zoomIn()"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14M12 5v14" />
			</svg>
		</button>
		<button
			class="p-1.5 hover:bg-white/20 rounded transition-colors"
			@click="zoom.resetZoom()"
			title="Reset zoom (0)"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
			</svg>
		</button>
	</div>
</template>
