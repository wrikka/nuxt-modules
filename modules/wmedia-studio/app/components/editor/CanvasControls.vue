<script setup lang="ts">
const props = defineProps<{
	zoom: number;
	showGrid: boolean;
	snapToGrid: boolean;
	gridSize: number;
}>();

const emit = defineEmits<{
	updateZoom: [zoom: number];
	toggleGrid: [];
	toggleSnap: [];
	updateGridSize: [size: number];
}>();

const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400];
const presetSizes = [
	{ name: "Instagram Post", width: 1080, height: 1080 },
	{ name: "Instagram Story", width: 1080, height: 1920 },
	{ name: "YouTube Thumbnail", width: 1280, height: 720 },
	{ name: "Facebook Cover", width: 820, height: 312 },
	{ name: "Twitter Header", width: 1500, height: 500 },
	{ name: "A4 Print", width: 2480, height: 3508 },
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<!-- Zoom -->
			<div class="flex items-center gap-2">
				<button
					@click="emit('updateZoom', Math.max(25, zoom - 25))"
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
				>
					<Icon name="mdi:minus" class="w-4 h-4" />
				</button>
				<select
					:value="zoom"
					@change="emit('updateZoom', +($event.target as HTMLSelectElement).value)"
					class="w-16 text-sm bg-transparent text-center"
				>
					<option v-for="level in zoomLevels" :key="level" :value="level">
						{{ level }}%
					</option>
				</select>
				<button
					@click="emit('updateZoom', Math.min(400, zoom + 25))"
					class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
				>
					<Icon name="mdi:plus" class="w-4 h-4" />
				</button>
			</div>

			<div class="w-px h-6 bg-gray-300 dark:bg-gray-600" />

			<!-- Grid -->
			<button
				@click="emit('toggleGrid')"
				:class="[
					'p-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm',
					showGrid
						? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
						: 'hover:bg-gray-100 dark:hover:bg-gray-700',
				]"
			>
				<Icon name="mdi:grid" class="w-4 h-4" />
				<span class="hidden sm:inline">Grid</span>
			</button>

			<button
				@click="emit('toggleSnap')"
				:class="[
					'p-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm',
					snapToGrid
						? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
						: 'hover:bg-gray-100 dark:hover:bg-gray-700',
				]"
				:disabled="!showGrid"
			>
				<Icon name="mdi:magnet" class="w-4 h-4" />
				<span class="hidden sm:inline">Snap</span>
			</button>

			<div v-if="showGrid" class="flex items-center gap-2">
				<span class="text-xs text-gray-500">{{ gridSize }}px</span>
				<input
					type="range"
					:value="gridSize"
					@input="emit('updateGridSize', +($event.target as HTMLInputElement).value)"
					min="8"
					max="64"
					step="8"
					class="w-20"
				/>
			</div>
		</div>

		<!-- Presets -->
		<div class="flex items-center gap-2">
			<span class="text-sm text-gray-500 hidden md:inline">Presets:</span>
			<select class="text-sm bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5">
				<option value="">Custom</option>
				<option
					v-for="preset in presetSizes"
					:key="preset.name"
					:value="preset.name"
				>
					{{ preset.name }} ({{ preset.width }}×{{ preset.height }})
				</option>
			</select>
		</div>
	</div>
</template>
