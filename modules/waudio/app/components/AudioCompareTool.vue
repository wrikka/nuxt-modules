<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const comparisonMode = ref<"ab" | "split" | "spectrum">("ab");
const isPlayingA = ref(false);
const isPlayingB = ref(false);
const volumeA = ref(100);
const volumeB = ref(100);
const zoomLevel = ref(100);

const togglePlayA = () => {
	isPlayingA.value = !isPlayingA.value;
	if (isPlayingA.value) isPlayingB.value = false;
};

const togglePlayB = () => {
	isPlayingB.value = !isPlayingB.value;
	if (isPlayingB.value) isPlayingA.value = false;
};

const swapSources = () => {
	console.log("Swapping A/B sources");
};

const syncPlayhead = () => {
	console.log("Syncing playhead");
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
						d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
					/>
				</svg>
				A/B Compare Tool
			</h3>
			<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
				<button
					v-for='mode in [
						{ id: "ab", label: "A/B" },
						{ id: "split", label: "Split" },
						{ id: "spectrum", label: "Spectrum" },
					] as const'
					:key="mode.id"
					@click="comparisonMode = mode.id"
					:class="[
						'px-3 py-1 text-xs font-medium rounded transition-colors',
						comparisonMode === mode.id
							? 'bg-purple-600 text-white'
							: 'text-gray-400 hover:text-white hover:bg-gray-700',
					]"
				>
					{{ mode.label }}
				</button>
			</div>
		</div>

		<!-- Waveform Display -->
		<div class="relative h-40 bg-gray-800 rounded-lg overflow-hidden">
			<!-- A Waveform (Top half) -->
			<div class="absolute top-0 left-0 right-0 h-1/2 bg-gray-800 border-b border-gray-700">
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-xs text-gray-500">Source A Waveform</div>
				</div>
				<div class="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
					A
				</div>
			</div>

			<!-- B Waveform (Bottom half) -->
			<div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-800">
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-xs text-gray-500">Source B Waveform</div>
				</div>
				<div class="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
					B
				</div>
			</div>

			<!-- Difference overlay (for spectrum mode) -->
			<div
				v-if="comparisonMode === 'spectrum'"
				class="absolute inset-0 bg-purple-900/10 flex items-center justify-center"
			>
				<div class="text-xs text-purple-400">Difference Visualization</div>
			</div>
		</div>

		<!-- Transport Controls -->
		<div class="grid grid-cols-2 gap-4">
			<!-- Source A Controls -->
			<div class="space-y-2 p-3 bg-gray-800 rounded-lg">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-blue-500"></div>
						<span class="text-sm font-medium text-white">Source A</span>
					</div>
					<button
						@click="togglePlayA"
						:class="[
							'p-2 rounded-lg transition-colors',
							isPlayingA
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-400 hover:text-white',
						]"
					>
						<svg
							v-if="!isPlayingA"
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					</button>
				</div>
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-500">Volume</span>
						<span class="text-white">{{ volumeA }}%</span>
					</div>
					<input
						v-model="volumeA"
						type="range"
						min="0"
						max="100"
						class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>

			<!-- Source B Controls -->
			<div class="space-y-2 p-3 bg-gray-800 rounded-lg">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
						<span class="text-sm font-medium text-white">Source B</span>
					</div>
					<button
						@click="togglePlayB"
						:class="[
							'p-2 rounded-lg transition-colors',
							isPlayingB
								? 'bg-green-600 text-white'
								: 'bg-gray-700 text-gray-400 hover:text-white',
						]"
					>
						<svg
							v-if="!isPlayingB"
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					</button>
				</div>
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-500">Volume</span>
						<span class="text-white">{{ volumeB }}%</span>
					</div>
					<input
						v-model="volumeB"
						type="range"
						min="0"
						max="100"
						class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="flex gap-2">
			<button
				@click="swapSources"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
			>
				Swap A/B
			</button>
			<button
				@click="syncPlayhead"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
			>
				Sync Playhead
			</button>
		</div>

		<!-- Zoom -->
		<div class="space-y-1">
			<div class="flex justify-between text-xs">
				<span class="text-gray-500">Zoom</span>
				<span class="text-white">{{ zoomLevel }}%</span>
			</div>
			<input
				v-model="zoomLevel"
				type="range"
				min="25"
				max="400"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
		</div>
	</div>
</template>
