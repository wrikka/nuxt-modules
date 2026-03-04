<script setup lang="ts">
import type { LoudnessData } from "#shared/types/audio";

const props = defineProps<{
	audioContext: AudioContext | null;
	sourceNode?: AudioNode;
}>();

const targetLoudness = ref(-16);
const truePeakLimit = ref(-1);

const loudnessData = ref<LoudnessData>({
	integrated: -70,
	momentary: -70,
	shortTerm: -70,
	peak: -70,
	truePeak: -70,
	lra: 0,
});

let analyser: AnalyserNode | null = null;
let animationId: number | null = null;
let isAnalyzing = ref(false);

const startMetering = () => {
	if (!props.audioContext) return;

	analyser = props.audioContext.createAnalyser();
	analyser.fftSize = 2048;

	if (props.sourceNode) {
		props.sourceNode.connect(analyser);
	}

	isAnalyzing.value = true;
	analyze();
};

const stopMetering = () => {
	isAnalyzing.value = false;
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
};

const analyze = () => {
	if (!isAnalyzing.value || !analyser) return;

	animationId = requestAnimationFrame(analyze);

	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);

	// Calculate peak
	let peak = 0;
	for (let i = 0; i < bufferLength; i++) {
		const sample = (dataArray[i]! - 128) / 128;
		peak = Math.max(peak, Math.abs(sample));
	}
	const peakDB = 20 * Math.log10(peak || 0.0001);

	// Simulate loudness calculation (simplified)
	const integrated = peakDB - 12;
	const momentary = peakDB - 8;
	const shortTerm = peakDB - 10;

	loudnessData.value = {
		integrated,
		momentary,
		shortTerm,
		peak: peakDB,
		truePeak: peakDB + 0.5,
		lra: Math.abs(momentary - integrated),
	};
};

const normalizeAudio = async () => {
	// Emit event to parent to normalize
	emit("normalize", targetLoudness.value, truePeakLimit.value);
};

const emit = defineEmits<{
	normalize: [targetLufs: number, truePeak: number];
}>();

const getLoudnessColor = (lufs: number): string => {
	if (lufs > targetLoudness.value + 2) return "text-red-400";
	if (lufs < targetLoudness.value - 2) return "text-yellow-400";
	return "text-green-400";
};

const getMeterWidth = (lufs: number): string => {
	const min = -60;
	const max = 0;
	const percent = ((lufs - min) / (max - min)) * 100;
	return `${Math.max(0, Math.min(100, percent))}%`;
};

onUnmounted(() => {
	stopMetering();
});

defineExpose({
	startMetering,
	stopMetering,
	loudnessData,
});
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>Loudness Meter (LUFS)</span>
			<div class="flex items-center gap-2">
				<button
					@click="isAnalyzing ? stopMetering() : startMetering()"
					:class="[
						'px-2 py-1 rounded text-xs transition-colors',
						isAnalyzing
							? 'bg-red-600 hover:bg-red-700 text-white'
							: 'bg-green-600 hover:bg-green-700 text-white',
					]"
				>
					{{ isAnalyzing ? "Stop" : "Start" }}
				</button>
			</div>
		</div>

		<!-- Meters -->
		<div class="space-y-3 mb-4">
			<!-- Integrated -->
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Integrated</span>
					<span :class="getLoudnessColor(loudnessData.integrated)">{{
							loudnessData.integrated.toFixed(1)
						}} LUFS</span>
				</div>
				<div class="h-2 bg-gray-800 rounded overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
						:style="{ width: getMeterWidth(loudnessData.integrated) }"
					/>
				</div>
			</div>

			<!-- Momentary -->
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Momentary</span>
					<span :class="getLoudnessColor(loudnessData.momentary)">{{
							loudnessData.momentary.toFixed(1)
						}} LUFS</span>
				</div>
				<div class="h-2 bg-gray-800 rounded overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
						:style="{ width: getMeterWidth(loudnessData.momentary) }"
					/>
				</div>
			</div>

			<!-- Short Term -->
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Short Term</span>
					<span :class="getLoudnessColor(loudnessData.shortTerm)">{{
							loudnessData.shortTerm.toFixed(1)
						}} LUFS</span>
				</div>
				<div class="h-2 bg-gray-800 rounded overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
						:style="{ width: getMeterWidth(loudnessData.shortTerm) }"
					/>
				</div>
			</div>

			<!-- True Peak -->
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">True Peak</span>
					<span
						:class="loudnessData.truePeak > -1 ? 'text-red-400' : 'text-green-400'"
					>{{ loudnessData.truePeak.toFixed(1) }} dBTP</span>
				</div>
				<div class="h-2 bg-gray-800 rounded overflow-hidden">
					<div
						:class="[
							'h-full transition-all duration-100',
							loudnessData.truePeak > -1 ? 'bg-red-500' : 'bg-blue-500',
						]"
						:style="{ width: getMeterWidth(loudnessData.truePeak + 60) }"
					/>
				</div>
			</div>
		</div>

		<!-- LRA -->
		<div class="flex items-center justify-between text-xs mb-4">
			<span class="text-gray-400">Loudness Range (LRA)</span>
			<span class="text-gray-300">{{ loudnessData.lra.toFixed(1) }} LU</span>
		</div>

		<!-- Normalization Settings -->
		<div class="border-t border-gray-700 pt-4">
			<div class="space-y-3">
				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Target Loudness</span>
						<span class="text-gray-300">{{ targetLoudness }} LUFS</span>
					</div>
					<input
						v-model.number="targetLoudness"
						type="range"
						min="-23"
						max="-14"
						step="0.5"
						class="w-full accent-blue-500"
					>
				</div>

				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">True Peak Limit</span>
						<span class="text-gray-300">{{ truePeakLimit }} dBTP</span>
					</div>
					<input
						v-model.number="truePeakLimit"
						type="range"
						min="-6"
						max="-0.1"
						step="0.1"
						class="w-full accent-blue-500"
					>
				</div>

				<button
					@click="normalizeAudio"
					class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
				>
					Normalize to {{ targetLoudness }} LUFS
				</button>
			</div>
		</div>
	</div>
</template>
