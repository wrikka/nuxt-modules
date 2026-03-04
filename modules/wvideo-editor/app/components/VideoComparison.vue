<script setup lang="ts">
const emit = defineEmits<{ close: []; compare: [] }>();
const mode = ref("side-by-side");
const zoom = ref(100);
const syncPlayback = ref(true);
const currentTime = ref(0);
</script>
<template>
	<div class="video-comparison bg-white dark:bg-gray-800 rounded-xl p-4 w-[600px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:view-column" class="w-5 h-5 text-blue-500" />Video
				Comparison
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				v-for='m in ["side-by-side", "split", "difference"]'
				:key="m"
				class="px-3 py-1.5 rounded-lg text-sm capitalize transition-colors"
				:class="mode === m
				? 'bg-blue-600 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="mode = m"
			>
				{{ m.replace("-", " ") }}
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div v-if="mode === 'side-by-side'" class="grid grid-cols-2 h-full gap-1">
				<div class="bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
					Original
				</div>
				<div class="bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
					Modified
				</div>
			</div>
			<div v-else-if="mode === 'split'" class="flex h-full">
				<div class="w-1/2 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm border-r-2 border-blue-500">
					Original
				</div>
				<div class="w-1/2 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
					Modified
				</div>
			</div>
			<div
				v-else
				class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm"
			>
				Difference View
			</div>
		</div>
		<div class="flex items-center gap-4 mb-4">
			<div class="flex-1">
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Zoom</span><span
						class="text-blue-500"
					>{{ zoom }}%</span>
				</div>
				<input
					v-model="zoom"
					type="range"
					min="50"
					max="200"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
			</div>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			><input
					v-model="syncPlayback"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>Sync Playback</label>
		</div>
		<button
			class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="emit('compare')"
		>
			Export Comparison
		</button>
	</div>
</template>
