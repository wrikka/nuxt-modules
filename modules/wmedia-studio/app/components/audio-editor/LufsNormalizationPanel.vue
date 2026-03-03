<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const targetLufs = ref(-14);
const truePeakLimit = ref(-1);
const loudnessRange = ref(8);
const isAnalyzing = ref(false);
const isNormalizing = ref(false);

const currentLufs = ref(-12.5);
const currentTruePeak = ref(-0.5);
const currentRange = ref(7.8);

const presets = [
	{ name: "Spotify", lufs: -14, peak: -1 },
	{ name: "YouTube", lufs: -14, peak: -1 },
	{ name: "Apple Music", lufs: -16, peak: -1 },
	{ name: "Broadcast", lufs: -23, peak: -6 },
	{ name: "CD Master", lufs: -9, peak: -0.1 },
];

const applyPreset = (preset: typeof presets[0]) => {
	targetLufs.value = preset.lufs;
	truePeakLimit.value = preset.peak;
};

const analyzeLoudness = async () => {
	if (!props.audioBuffer) return;
	isAnalyzing.value = true;
	await new Promise(resolve => setTimeout(resolve, 1500));
	isAnalyzing.value = false;
};

const normalize = async () => {
	if (!props.audioBuffer) return;
	isNormalizing.value = true;
	await new Promise(resolve => setTimeout(resolve, 2000));
	isNormalizing.value = false;
};

const gainNeeded = computed(() => {
	return targetLufs.value - currentLufs.value;
});
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
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				LUFS Normalization
			</h3>
		</div>

		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<p class="text-xs text-blue-300">
				Normalize audio to broadcast/streaming standards using integrated LUFS
				loudness measurement.
			</p>
		</div>

		<!-- Platform Presets -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Platform Presets</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					@click="applyPreset(preset)"
					class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
				>
					{{ preset.name }}
					<span class="text-gray-500 text-xs ml-1"
					>({{ preset.lufs }} LUFS)</span>
				</button>
			</div>
		</div>

		<!-- Current Analysis -->
		<div class="grid grid-cols-3 gap-2">
			<div class="p-3 bg-gray-800 rounded-lg text-center">
				<div class="text-xs text-gray-500">Integrated</div>
				<div
					class="text-xl font-bold"
					:class="currentLufs > targetLufs ? 'text-yellow-400' : 'text-green-400'"
				>
					{{ currentLufs.toFixed(1) }}
				</div>
				<div class="text-xs text-gray-500">LUFS</div>
			</div>
			<div class="p-3 bg-gray-800 rounded-lg text-center">
				<div class="text-xs text-gray-500">True Peak</div>
				<div
					class="text-xl font-bold"
					:class="currentTruePeak > truePeakLimit ? 'text-red-400' : 'text-green-400'"
				>
					{{ currentTruePeak.toFixed(1) }}
				</div>
				<div class="text-xs text-gray-500">dBTP</div>
			</div>
			<div class="p-3 bg-gray-800 rounded-lg text-center">
				<div class="text-xs text-gray-500">Loudness Range</div>
				<div class="text-xl font-bold text-white">
					{{ currentRange.toFixed(1) }}
				</div>
				<div class="text-xs text-gray-500">LU</div>
			</div>
		</div>

		<!-- Target Settings -->
		<div class="space-y-3">
			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-400">Target LUFS</span>
					<span class="text-white">{{ targetLufs }} LUFS</span>
				</div>
				<input
					v-model="targetLufs"
					type="range"
					min="-30"
					max="-8"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-500">
					<span>-30 (Quiet)</span>
					<span>-8 (Loud)</span>
				</div>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-400">True Peak Limit</span>
					<span class="text-white">{{ truePeakLimit }} dBTP</span>
				</div>
				<input
					v-model="truePeakLimit"
					type="range"
					min="-6"
					max="-0.1"
					step="0.1"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-400">Max Loudness Range</span>
					<span class="text-white">{{ loudnessRange }} LU</span>
				</div>
				<input
					v-model="loudnessRange"
					type="range"
					min="3"
					max="20"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- Gain Needed -->
		<div class="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
			<span class="text-sm text-gray-400">Gain Adjustment Needed</span>
			<span
				class="text-lg font-bold"
				:class="gainNeeded > 0 ? 'text-green-400' : 'text-yellow-400'"
			>
				{{ gainNeeded > 0 ? "+" : "" }}{{ gainNeeded.toFixed(1) }} dB
			</span>
		</div>

		<!-- Buttons -->
		<div class="flex gap-2">
			<button
				@click="analyzeLoudness"
				:disabled="!audioBuffer || isAnalyzing"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				<span v-if="isAnalyzing" class="flex items-center justify-center gap-2">
					<svg
						class="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						>
						</circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						>
						</path>
					</svg>
					Analyzing...
				</span>
				<span v-else>Analyze</span>
			</button>
			<button
				@click="normalize"
				:disabled="!audioBuffer || isNormalizing || isAnalyzing"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				<span
					v-if="isNormalizing"
					class="flex items-center justify-center gap-2"
				>
					<svg
						class="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						>
						</circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						>
						</path>
					</svg>
					Normalizing...
				</span>
				<span v-else>Normalize</span>
			</button>
		</div>
	</div>
</template>
