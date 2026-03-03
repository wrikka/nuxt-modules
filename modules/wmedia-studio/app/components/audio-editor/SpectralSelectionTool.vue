<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const selectionMode = ref<"rectangular" | "lasso" | "brush">("rectangular");
const frequencyRange = ref({ min: 100, max: 10000 });
const timeRange = ref({ start: 0, end: 10 });
const brushSize = ref(50);
const spectralView = ref<"linear" | "log">("log");

const tools = [
	{ id: "rectangular", name: "Rectangle", icon: "square" },
	{ id: "lasso", name: "Lasso", icon: "pencil" },
	{ id: "brush", name: "Brush", icon: "brush" },
] as const;

const applySelection = () => {
	console.log("Applying spectral selection:", { frequencyRange, timeRange });
};

const invertSelection = () => {
	console.log("Inverting selection");
};

const clearSelection = () => {
	frequencyRange.value = { min: 20, max: 20000 };
	timeRange.value = { start: 0, end: props.audioBuffer?.duration || 10 };
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
					/>
				</svg>
				Spectral Selection
			</h3>
			<select
				v-model="spectralView"
				class="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
			>
				<option value="log">Log Scale</option>
				<option value="linear">Linear Scale</option>
			</select>
		</div>

		<!-- Spectrogram Preview -->
		<div class="relative h-32 bg-gray-800 rounded-lg overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
				Spectrogram View ({{ spectralView }})
			</div>
			<!-- Selection Overlay -->
			<div
				class="absolute border-2 border-purple-500 bg-purple-500/20 rounded"
				:style="{
					left: '20%',
					right: '20%',
					top: '30%',
					bottom: '20%',
				}"
			>
			</div>
			<!-- Frequency labels -->
			<div class="absolute left-1 top-1 text-xs text-gray-400">
				{{ frequencyRange.max }}Hz
			</div>
			<div class="absolute left-1 bottom-1 text-xs text-gray-400">
				{{ frequencyRange.min }}Hz
			</div>
			<div class="absolute right-1 top-1 text-xs text-gray-400">
				{{ timeRange.end }}s
			</div>
			<div class="absolute left-1 top-1/2 text-xs text-gray-400">
				{{ timeRange.start }}s
			</div>
		</div>

		<!-- Selection Tools -->
		<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
			<button
				v-for="tool in tools"
				:key="tool.id"
				@click="selectionMode = tool.id"
				:class="[
					'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2',
					selectionMode === tool.id
						? 'bg-purple-600 text-white'
						: 'text-gray-400 hover:text-white hover:bg-gray-700',
				]"
			>
				<svg
					v-if="tool.icon === 'square'"
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
				</svg>
				<svg
					v-else-if="tool.icon === 'pencil'"
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
						d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
					/>
				</svg>
				<svg
					v-else
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
						d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
					/>
				</svg>
				{{ tool.name }}
			</button>
		</div>

		<!-- Brush Size (for brush tool) -->
		<div v-if="selectionMode === 'brush'" class="space-y-1">
			<div class="flex justify-between">
				<label class="text-xs text-gray-400">Brush Size</label>
				<span class="text-xs text-white">{{ brushSize }}px</span>
			</div>
			<input
				v-model="brushSize"
				type="range"
				min="10"
				max="200"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
		</div>

		<!-- Frequency Range -->
		<div class="space-y-3">
			<label class="text-sm text-gray-400">Frequency Range</label>
			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Min (Hz)</label>
					<input
						v-model="frequencyRange.min"
						type="number"
						min="20"
						max="20000"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Max (Hz)</label>
					<input
						v-model="frequencyRange.max"
						type="number"
						min="20"
						max="20000"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					/>
				</div>
			</div>
			<input
				v-model="frequencyRange.min"
				type="range"
				min="20"
				max="20000"
				step="10"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
			<input
				v-model="frequencyRange.max"
				type="range"
				min="20"
				max="20000"
				step="10"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
		</div>

		<!-- Time Range -->
		<div class="space-y-3">
			<label class="text-sm text-gray-400">Time Range</label>
			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Start (s)</label>
					<input
						v-model="timeRange.start"
						type="number"
						min="0"
						:max="audioBuffer?.duration || 100"
						step="0.1"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">End (s)</label>
					<input
						v-model="timeRange.end"
						type="number"
						min="0"
						:max="audioBuffer?.duration || 100"
						step="0.1"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					/>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				@click="invertSelection"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
			>
				Invert
			</button>
			<button
				@click="clearSelection"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
			>
				Clear
			</button>
			<button
				@click="applySelection"
				:disabled="!audioBuffer"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
			>
				Apply
			</button>
		</div>
	</div>
</template>
