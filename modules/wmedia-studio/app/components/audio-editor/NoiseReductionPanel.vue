<script setup lang="ts">
import type { NoiseProfile } from "#shared/types/audio";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	apply: [profile: NoiseProfile, buffer: AudioBuffer];
}>();

const isProcessing = ref(false);
const noiseProfile = ref<NoiseProfile>({
	threshold: -60,
	reduction: 12,
	attack: 10,
	release: 100,
});

const isCapturing = ref(false);
const captureDuration = ref(2);
const capturedSample = ref<Float32Array | null>(null);

const captureNoiseSample = async () => {
	if (!props.audioBuffer) return;

	isCapturing.value = true;

	// Capture first few seconds as noise profile
	const sampleRate = props.audioBuffer.sampleRate;
	const sampleLength = Math.min(
		captureDuration.value * sampleRate,
		props.audioBuffer.length,
	);

	const channel = props.audioBuffer.getChannelData(0);
	capturedSample.value = channel.slice(0, sampleLength);

	setTimeout(() => {
		isCapturing.value = false;
	}, captureDuration.value * 1000);
};

const applyNoiseReduction = async () => {
	if (!props.audioBuffer || !capturedSample.value) return;

	isProcessing.value = true;

	try {
		const audioContext = new OfflineAudioContext(
			props.audioBuffer.numberOfChannels,
			props.audioBuffer.length,
			props.audioBuffer.sampleRate,
		);

		const source = audioContext.createBufferSource();
		source.buffer = props.audioBuffer;

		// Create noise gate
		const noiseGate = audioContext.createDynamicsCompressor();
		noiseGate.threshold.value = noiseProfile.value.threshold;
		noiseGate.ratio.value = noiseProfile.value.reduction;
		noiseGate.attack.value = noiseProfile.value.attack / 1000;
		noiseGate.release.value = noiseProfile.value.release / 1000;

		// Create high-pass filter to remove low rumble
		const highPass = audioContext.createBiquadFilter();
		highPass.type = "highpass";
		highPass.frequency.value = 80;

		source.connect(highPass);
		highPass.connect(noiseGate);
		noiseGate.connect(audioContext.destination);

		source.start();

		const processedBuffer = await audioContext.startRendering();

		emit(
			"apply",
			{ ...noiseProfile.value, sample: capturedSample.value },
			processedBuffer,
		);
	} catch (error) {
		console.error("Noise reduction failed:", error);
	} finally {
		isProcessing.value = false;
	}
};

const resetProfile = () => {
	noiseProfile.value = {
		threshold: -60,
		reduction: 12,
		attack: 10,
		release: 100,
	};
	capturedSample.value = null;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">AI Noise Reduction</span>
			<span v-if="capturedSample" class="text-green-400 text-xs"
			>Profile Captured</span>
		</div>

		<div class="space-y-4">
			<!-- Capture Noise Sample -->
			<div class="bg-gray-800 rounded p-3">
				<label class="block text-gray-400 text-xs mb-2"
				>1. Capture Noise Sample</label>
				<div class="flex items-center gap-2">
					<button
						@click="captureNoiseSample"
						:disabled="!audioBuffer || isCapturing"
						:class="[
							'flex-1 px-3 py-2 rounded text-sm transition-colors',
							isCapturing
								? 'bg-red-600 text-white animate-pulse'
								: 'bg-blue-600 hover:bg-blue-700 text-white',
							(!audioBuffer || isCapturing) && 'opacity-50 cursor-not-allowed',
						]"
					>
						{{
							isCapturing
							? `Capturing... ${captureDuration}s`
							: "Capture Noise"
						}}
					</button>
					<select
						v-model="captureDuration"
						class="bg-gray-700 text-white rounded px-2 py-2 text-sm border border-gray-600"
					>
						<option :value="1">1s</option>
						<option :value="2">2s</option>
						<option :value="5">5s</option>
					</select>
				</div>
			</div>

			<!-- Controls -->
			<div class="space-y-3">
				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Threshold</span>
						<span class="text-gray-300">{{ noiseProfile.threshold }}dB</span>
					</div>
					<input
						v-model.number="noiseProfile.threshold"
						type="range"
						min="-80"
						max="-20"
						step="1"
						class="w-full accent-blue-500"
					>
				</div>

				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Reduction</span>
						<span class="text-gray-300">{{ noiseProfile.reduction }}dB</span>
					</div>
					<input
						v-model.number="noiseProfile.reduction"
						type="range"
						min="0"
						max="30"
						step="1"
						class="w-full accent-blue-500"
					>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div>
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-400">Attack</span>
							<span class="text-gray-300">{{ noiseProfile.attack }}ms</span>
						</div>
						<input
							v-model.number="noiseProfile.attack"
							type="range"
							min="1"
							max="100"
							step="1"
							class="w-full accent-blue-500"
						>
					</div>

					<div>
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-400">Release</span>
							<span class="text-gray-300">{{ noiseProfile.release }}ms</span>
						</div>
						<input
							v-model.number="noiseProfile.release"
							type="range"
							min="10"
							max="500"
							step="10"
							class="w-full accent-blue-500"
						>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-2">
				<button
					@click="applyNoiseReduction"
					:disabled="!audioBuffer || !capturedSample || isProcessing"
					class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
				>
					{{ isProcessing ? "Processing..." : "Apply Reduction" }}
				</button>
				<button
					@click="resetProfile"
					class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
</template>
