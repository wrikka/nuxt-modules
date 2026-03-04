<script setup lang="ts">
const props = defineProps<{
	audioContext: AudioContext | null;
	audioBuffer: AudioBuffer | null;
}>();

const isAnalyzing = ref(false);
const analysisResults = ref({
	peakLevel: -3.2,
	rmsLevel: -18.5,
	crestFactor: 15.3,
	dynamicRange: 12.8,
	lufs: -14.2,
	truePeak: -1.1,
	dcOffset: 0.02,
	noiseFloor: -96.5,
});

const formatDb = (db: number): string => {
	return db > 0 ? `+${db.toFixed(1)}` : db.toFixed(1);
};

const runAnalysis = async () => {
	if (!props.audioBuffer) return;
	isAnalyzing.value = true;
	await new Promise(resolve => setTimeout(resolve, 1500));
	isAnalyzing.value = false;
};

const exportReport = () => {
	const report = {
		timestamp: new Date().toISOString(),
		results: analysisResults.value,
	};
	console.log("Exporting report:", report);
};

const stats = computed(() => [
	{
		label: "Peak Level",
		value: formatDb(analysisResults.value.peakLevel),
		unit: "dBFS",
		color: "text-yellow-400",
	},
	{
		label: "RMS Level",
		value: formatDb(analysisResults.value.rmsLevel),
		unit: "dBFS",
		color: "text-white",
	},
	{
		label: "LUFS (Integrated)",
		value: formatDb(analysisResults.value.lufs),
		unit: "LUFS",
		color: "text-purple-400",
	},
	{
		label: "True Peak",
		value: formatDb(analysisResults.value.truePeak),
		unit: "dBTP",
		color: "text-white",
	},
	{
		label: "Crest Factor",
		value: analysisResults.value.crestFactor.toFixed(1),
		unit: "dB",
		color: "text-blue-400",
	},
	{
		label: "Dynamic Range",
		value: analysisResults.value.dynamicRange.toFixed(1),
		unit: "dB",
		color: "text-green-400",
	},
	{
		label: "DC Offset",
		value: analysisResults.value.dcOffset.toFixed(3),
		unit: "%",
		color: "text-gray-400",
	},
	{
		label: "Noise Floor",
		value: formatDb(analysisResults.value.noiseFloor),
		unit: "dBFS",
		color: "text-gray-400",
	},
]);
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
				Audio Stats Dashboard
			</h3>
			<button
				@click="runAnalysis"
				:disabled="!audioBuffer || isAnalyzing"
				class="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white text-sm rounded transition-colors"
			>
				<span v-if="isAnalyzing" class="flex items-center gap-1">
					<svg
						class="animate-spin h-3 w-3"
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
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-3">
			<div
				v-for="stat in stats"
				:key="stat.label"
				class="p-3 bg-gray-800 rounded-lg"
			>
				<div class="text-xs text-gray-500">{{ stat.label }}</div>
				<div class="flex items-baseline gap-1">
					<span class="text-xl font-bold" :class="stat.color">{{
						stat.value
					}}</span>
					<span class="text-xs text-gray-500">{{ stat.unit }}</span>
				</div>
			</div>
		</div>

		<!-- Visualizations -->
		<div class="space-y-3">
			<!-- Waveform overview -->
			<div class="p-3 bg-gray-800 rounded-lg">
				<div class="text-xs text-gray-400 mb-2">Waveform Overview</div>
				<div class="h-16 bg-gray-900 rounded flex items-center justify-center">
					<div class="text-xs text-gray-500">Waveform mini view</div>
				</div>
			</div>

			<!-- Level history -->
			<div class="p-3 bg-gray-800 rounded-lg">
				<div class="text-xs text-gray-400 mb-2">Level History</div>
				<div class="h-16 bg-gray-900 rounded relative">
					<div class="absolute inset-0 flex items-end justify-around px-2 pb-1">
						<div
							v-for="i in 20"
							:key="i"
							class="w-1 rounded-t bg-purple-500/60"
							:style="{ height: `${20 + Math.random() * 60}%` }"
						>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Recommendations -->
		<div class="p-3 bg-gray-800 rounded-lg">
			<div class="text-sm font-medium text-white mb-2">Analysis Summary</div>
			<div class="space-y-1 text-sm">
				<div
					v-if="analysisResults.peakLevel > -1"
					class="flex items-center gap-2 text-yellow-400"
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
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					Peak level close to clipping. Consider reducing gain.
				</div>
				<div
					v-if="analysisResults.dynamicRange < 8"
					class="flex items-center gap-2 text-yellow-400"
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
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Low dynamic range. Audio may be over-compressed.
				</div>
				<div
					v-if="analysisResults.crestFactor > 20"
					class="flex items-center gap-2 text-blue-400"
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
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					High crest factor. Good dynamic range detected.
				</div>
			</div>
		</div>

		<!-- Export -->
		<button
			@click="exportReport"
			class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
		>
			Export Analysis Report
		</button>
	</div>
</template>
