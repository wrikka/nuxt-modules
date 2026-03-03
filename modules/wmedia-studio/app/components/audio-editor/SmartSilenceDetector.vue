<script setup lang="ts">
interface SilenceDetectionResult {
	start: number;
	end: number;
	duration: number;
}

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const threshold = ref(-40);
const minDuration = ref(0.5);
const fadeInDuration = ref(0.01);
const fadeOutDuration = ref(0.01);
const isAnalyzing = ref(false);
const detectedSilences = ref<SilenceDetectionResult[]>([]);
const selectedSilences = ref<Set<number>>(new Set());

const detectSilences = async () => {
	if (!props.audioBuffer) return;

	isAnalyzing.value = true;
	detectedSilences.value = [];

	const channelData = props.audioBuffer.getChannelData(0);
	const sampleRate = props.audioBuffer.sampleRate;
	const thresholdLinear = Math.pow(10, threshold.value / 20);
	const minSamples = Math.floor(minDuration.value * sampleRate);

	let silenceStart = -1;
	const silences: SilenceDetectionResult[] = [];

	for (let i = 0; i < channelData.length; i++) {
		const amplitude = Math.abs(channelData[i]!);

		if (amplitude < thresholdLinear) {
			if (silenceStart === -1) {
				silenceStart = i;
			}
		} else {
			if (silenceStart !== -1) {
				const silenceDuration = (i - silenceStart) / sampleRate;
				if (silenceDuration >= minDuration.value) {
					silences.push({
						start: silenceStart / sampleRate,
						end: i / sampleRate,
						duration: silenceDuration,
					});
				}
				silenceStart = -1;
			}
		}
	}

	// Check if audio ends with silence
	if (silenceStart !== -1) {
		const silenceDuration = (channelData.length - silenceStart) / sampleRate;
		if (silenceDuration >= minDuration.value) {
			silences.push({
				start: silenceStart / sampleRate,
				end: channelData.length / sampleRate,
				duration: silenceDuration,
			});
		}
	}

	detectedSilences.value = silences;
	isAnalyzing.value = false;
};

const toggleSelection = (index: number) => {
	if (selectedSilences.value.has(index)) {
		selectedSilences.value.delete(index);
	} else {
		selectedSilences.value.add(index);
	}
};

const selectAll = () => {
	detectedSilences.value.forEach((_, index) => {
		selectedSilences.value.add(index);
	});
};

const deselectAll = () => {
	selectedSilences.value.clear();
};

const removeSelectedSilences = () => {
	// In real implementation, this would process the audio
	console.log("Removing silences:", Array.from(selectedSilences.value));
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const ms = Math.floor((seconds % 1) * 100);
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}.${ms.toString().padStart(2, "0")}`;
};

const totalSilenceDuration = computed(() => {
	return detectedSilences.value
		.filter((_, index) => selectedSilences.value.has(index))
		.reduce((sum, s) => sum + s.duration, 0);
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
						d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
					/>
				</svg>
				Smart Silence Detector
			</h3>
			<span v-if="detectedSilences.length > 0" class="text-sm text-gray-400">
				{{ detectedSilences.length }} regions found
			</span>
		</div>

		<!-- Controls -->
		<div class="grid grid-cols-2 gap-3">
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Threshold (dB)</label>
				<div class="flex items-center gap-2">
					<input
						v-model="threshold"
						type="range"
						min="-80"
						max="-20"
						class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
					<span class="text-sm text-white w-12 text-right">{{
						threshold
					}}</span>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-400">Min Duration (s)</label>
				<div class="flex items-center gap-2">
					<input
						v-model="minDuration"
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
					<span class="text-sm text-white w-12 text-right">{{
							minDuration
						}}s</span>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-400">Fade In (s)</label>
				<input
					v-model="fadeInDuration"
					type="number"
					step="0.001"
					min="0"
					max="1"
					class="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
				/>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-400">Fade Out (s)</label>
				<input
					v-model="fadeOutDuration"
					type="number"
					step="0.001"
					min="0"
					max="1"
					class="w-full px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
				/>
			</div>
		</div>

		<!-- Detect Button -->
		<button
			@click="detectSilences"
			:disabled="!audioBuffer || isAnalyzing"
			class="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
		>
			<svg
				v-if="isAnalyzing"
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
			<span v-else class="flex items-center gap-2">
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
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				Detect Silence Regions
			</span>
		</button>

		<!-- Results -->
		<div v-if="detectedSilences.length > 0" class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<button
						@click="selectAll"
						class="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
					>
						Select All
					</button>
					<button
						@click="deselectAll"
						class="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
					>
						Deselect All
					</button>
				</div>
				<span class="text-xs text-gray-400">
					Selected: {{ formatTime(totalSilenceDuration) }}
				</span>
			</div>

			<div class="max-h-48 overflow-y-auto space-y-1">
				<div
					v-for="(silence, index) in detectedSilences"
					:key="index"
					@click="toggleSelection(index)"
					:class="[
						'flex items-center justify-between p-2 rounded cursor-pointer transition-colors',
						selectedSilences.has(index)
							? 'bg-purple-900/50 border border-purple-700'
							: 'bg-gray-800 hover:bg-gray-700',
					]"
				>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							:checked="selectedSilences.has(index)"
							class="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
							@click.stop
							@change="toggleSelection(index)"
						/>
						<span class="text-sm text-white">Region {{ index + 1 }}</span>
					</div>
					<div class="text-xs text-gray-400 text-right">
						<div>
							{{ formatTime(silence.start) }} - {{ formatTime(silence.end) }}
						</div>
						<div>({{ silence.duration.toFixed(2) }}s)</div>
					</div>
				</div>
			</div>

			<button
				@click="removeSelectedSilences"
				:disabled="selectedSilences.size === 0"
				class="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Remove {{ selectedSilences.size }} Selected Silence(s)
			</button>
		</div>

		<div
			v-else-if="audioBuffer && !isAnalyzing"
			class="text-center py-4 text-gray-500 text-sm"
		>
			Click "Detect Silence Regions" to analyze audio
		</div>
	</div>
</template>
