<script setup lang="ts">
const zoom = defineModel<number>("zoom", { default: 1 });
const panX = defineModel<number>("panX", { default: 0 });
const panY = defineModel<number>("panY", { default: 0 });
const isZoomEnabled = defineModel<boolean>("isZoomEnabled", { default: false });

const zoomLevels = [1, 1.5, 2, 2.5, 3, 4];
const presets = [
	{ name: "Fit", zoom: 1, panX: 0, panY: 0 },
	{ name: "Top-Left", zoom: 2, panX: -0.25, panY: -0.25 },
	{ name: "Top-Right", zoom: 2, panX: 0.25, panY: -0.25 },
	{ name: "Center", zoom: 2, panX: 0, panY: 0 },
	{ name: "Bottom-Left", zoom: 2, panX: -0.25, panY: 0.25 },
	{ name: "Bottom-Right", zoom: 2, panX: 0.25, panY: 0.25 },
];

const applyPreset = (preset: typeof presets[0]) => {
	zoom.value = preset.zoom;
	panX.value = preset.panX;
	panY.value = preset.panY;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Zoom & Pan
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="isZoomEnabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="isZoomEnabled" class="space-y-3">
			<!-- Zoom Levels -->
			<div class="flex items-center gap-2">
				<span class="text-xs text-gray-500">Zoom:</span>
				<div class="flex gap-1">
					<button
						v-for="level in zoomLevels"
						:key="level"
						:class="[
							'px-2 py-1 text-xs rounded transition-all',
							zoom === level
								? 'bg-purple-600 text-white'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200',
						]"
						@click="zoom = level"
					>
						{{ level }}x
					</button>
				</div>
			</div>

			<!-- Presets -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
					@click="applyPreset(preset)"
				>
					{{ preset.name }}
				</button>
			</div>

			<!-- Manual Controls -->
			<div class="space-y-2">
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Pan X: {{ Math.round(panX * 100) }}%</label>
					<input
						v-model.number="panX"
						type="range"
						min="-0.5"
						max="0.5"
						step="0.05"
						class="w-full"
					/>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Pan Y: {{ Math.round(panY * 100) }}%</label>
					<input
						v-model.number="panY"
						type="range"
						min="-0.5"
						max="0.5"
						step="0.05"
						class="w-full"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
