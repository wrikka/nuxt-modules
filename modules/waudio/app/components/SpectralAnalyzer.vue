<script setup lang="ts">
import type { SpectralData } from "#shared/types/audio";

const props = defineProps<{
	audioContext: AudioContext | null;
	sourceNode?: AudioNode;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isActive = ref(false);
const spectralData = ref<SpectralData>({
	frequencies: new Float32Array(0),
	magnitudes: new Float32Array(0),
	peakFrequency: 0,
	peakMagnitude: 0,
});

let analyser: AnalyserNode | null = null;
let animationId: number | null = null;
let dataArray: Uint8Array;

const startAnalysis = () => {
	if (!props.audioContext || !canvasRef.value) return;

	analyser = props.audioContext.createAnalyser();
	analyser.fftSize = 2048;
	analyser.smoothingTimeConstant = 0.8;

	if (props.sourceNode) {
		props.sourceNode.connect(analyser);
	}

	const bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);

	isActive.value = true;
	draw();
};

const stopAnalysis = () => {
	isActive.value = false;
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
	if (analyser && props.sourceNode) {
		props.sourceNode.disconnect(analyser);
	}
};

const draw = () => {
	if (!isActive.value || !canvasRef.value || !analyser) return;

	const canvas = canvasRef.value;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	animationId = requestAnimationFrame(draw);

	analyser.getByteFrequencyData(
		dataArray as unknown as Uint8Array<ArrayBuffer>,
	);

	const width = canvas.width;
	const height = canvas.height;

	ctx.fillStyle = "#111827";
	ctx.fillRect(0, 0, width, height);

	const barWidth = (width / dataArray.length) * 2.5;
	let barHeight;
	let x = 0;

	let peakMag = 0;
	let peakFreq = 0;

	for (let i = 0; i < dataArray.length; i++) {
		barHeight = (dataArray[i]! / 255) * height;

		const frequency = (i * props.audioContext!.sampleRate!) / 2
			/ dataArray.length;
		if (dataArray[i]! > peakMag) {
			peakMag = dataArray[i]!;
			peakFreq = frequency;
		}

		const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
		gradient.addColorStop(0, "#1e40af");
		gradient.addColorStop(0.5, "#3b82f6");
		gradient.addColorStop(1, "#60a5fa");

		ctx.fillStyle = gradient;
		ctx.fillRect(x, height - barHeight, barWidth, barHeight);

		x += barWidth + 1;
	}

	spectralData.value = {
		frequencies: new Float32Array(dataArray.length),
		magnitudes: new Float32Array(dataArray).map(v => v / 255),
		peakFrequency: peakFreq,
		peakMagnitude: peakMag / 255,
	};

	// Draw frequency labels
	ctx.fillStyle = "#9ca3af";
	ctx.font = "10px sans-serif";
	ctx.fillText("20Hz", 5, height - 5);
	ctx.fillText("1kHz", width / 2 - 15, height - 5);
	ctx.fillText("20kHz", width - 35, height - 5);

	// Draw peak frequency indicator
	if (peakFreq > 0) {
		ctx.fillStyle = "#fbbf24";
		ctx.fillText(`Peak: ${peakFreq.toFixed(0)}Hz`, 5, 15);
	}
};

const formatFrequency = (freq: number): string => {
	if (freq >= 1000) {
		return `${(freq / 1000).toFixed(1)}kHz`;
	}
	return `${freq.toFixed(0)}Hz`;
};

onMounted(() => {
	if (props.audioContext) {
		startAnalysis();
	}
});

onUnmounted(() => {
	stopAnalysis();
});

watch(() => props.audioContext, (newContext) => {
	if (newContext) {
		stopAnalysis();
		startAnalysis();
	}
});

defineExpose({
	spectralData,
	startAnalysis,
	stopAnalysis,
});
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-2">
			<span class="text-gray-400 text-sm font-medium">Spectral Analyzer</span>
			<div class="flex items-center gap-2">
				<button
					@click="isActive ? stopAnalysis() : startAnalysis()"
					:class="[
						'px-2 py-1 rounded text-xs transition-colors',
						isActive
							? 'bg-red-600 hover:bg-red-700 text-white'
							: 'bg-green-600 hover:bg-green-700 text-white',
					]"
				>
					{{ isActive ? "Stop" : "Start" }}
				</button>
			</div>
		</div>
		<canvas
			ref="canvasRef"
			width="600"
			height="120"
			class="w-full rounded bg-gray-950"
		/>
		<div class="flex items-center justify-between mt-2 text-xs text-gray-500">
			<span>Peak: {{ formatFrequency(spectralData.peakFrequency) }}</span>
			<span>Magnitude: {{
					(spectralData.peakMagnitude * 100).toFixed(1)
				}}%</span>
		</div>
	</div>
</template>
