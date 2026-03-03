<script setup lang="ts">
const { zoomLevel, currentTime, duration, formatTime, setZoom } =
	useAudioEditor();

const zoomIn = () => {
	setZoom(Math.min(zoomLevel.value + 50, 500));
};

const zoomOut = () => {
	setZoom(Math.max(zoomLevel.value - 50, 10));
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700">
		<div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
			<span class="text-gray-400 text-sm font-medium">Waveform</span>
			<div class="flex items-center gap-2">
				<button
					@click="zoomOut"
					class="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
					title="Zoom Out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
						/>
					</svg>
				</button>
				<span class="text-gray-400 text-sm w-16 text-center">{{
						zoomLevel
					}}%</span>
				<button
					@click="zoomIn"
					class="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
					title="Zoom In"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
						/>
					</svg>
				</button>
			</div>
		</div>
		<div id="waveform" class="w-full h-48"></div>
		<div class="flex items-center justify-between px-4 py-1 bg-gray-800 border-t border-gray-700">
			<span class="text-gray-400 text-xs font-mono">{{
				formatTime(currentTime)
			}}</span>
			<span class="text-gray-400 text-xs font-mono">{{
				formatTime(duration)
			}}</span>
		</div>
	</div>
</template>
