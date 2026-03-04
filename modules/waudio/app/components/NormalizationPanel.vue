<script setup lang="ts">
const props = defineProps<{
	targetLoudness: number;
	truePeakLimit: number;
}>();

const emit = defineEmits<{
	normalize: [targetLufs: number, truePeak: number];
	autoNormalize: [];
}>();

const localTarget = ref(props.targetLoudness);
const localPeak = ref(props.truePeakLimit);
const normalizeMode = ref<"rms" | "ebu" | "peak">("ebu");
const isProcessing = ref(false);

const presetTargets = [
	{ name: "Streaming (-14 LUFS)", value: -14 },
	{ name: "Broadcast (-23 LUFS)", value: -23 },
	{ name: "CD/Master (-16 LUFS)", value: -16 },
	{ name: "Podcast (-16 LUFS)", value: -16 },
	{ name: "Mobile (-11 LUFS)", value: -11 },
];

const applyNormalization = async () => {
	isProcessing.value = true;
	emit("normalize", localTarget.value, localPeak.value);
	await new Promise(resolve => setTimeout(resolve, 1000));
	isProcessing.value = false;
};

const autoNormalize = async () => {
	isProcessing.value = true;
	emit("autoNormalize");
	await new Promise(resolve => setTimeout(resolve, 1500));
	isProcessing.value = false;
};

watch(() => props.targetLoudness, (val) => {
	localTarget.value = val;
});

watch(() => props.truePeakLimit, (val) => {
	localPeak.value = val;
});
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Audio Normalization</span>
		</div>

		<!-- Mode Selection -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Normalization Mode</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for='mode in ["rms", "ebu", "peak"] as const'
					:key="mode"
					@click="normalizeMode = mode"
					:class="[
						'px-2 py-1.5 rounded text-xs transition-colors',
						normalizeMode === mode
							? 'bg-blue-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					{{ mode.toUpperCase() }}
				</button>
			</div>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Quick Presets</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="preset in presetTargets"
					:key="preset.name"
					@click="localTarget = preset.value"
					:class="[
						'px-2 py-1 rounded text-xs transition-colors',
						localTarget === preset.value
							? 'bg-green-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					{{ preset.name }}
				</button>
			</div>
		</div>

		<!-- Controls -->
		<div class="space-y-3 mb-4">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Target Loudness (LUFS)</span>
					<span class="text-gray-300">{{ localTarget }}</span>
				</div>
				<input
					v-model.number="localTarget"
					type="range"
					min="-23"
					max="-8"
					step="0.5"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">True Peak Limit (dBTP)</span>
					<span class="text-gray-300">{{ localPeak }}</span>
				</div>
				<input
					v-model.number="localPeak"
					type="range"
					min="-6"
					max="-0.1"
					step="0.1"
					class="w-full accent-blue-500"
				>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="space-y-2">
			<button
				@click="applyNormalization"
				:disabled="isProcessing"
				class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				{{
					isProcessing ? "Processing..." : `Normalize to ${localTarget} LUFS`
				}}
			</button>
			<button
				@click="autoNormalize"
				:disabled="isProcessing"
				class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				Auto-Normalize All Clips
			</button>
		</div>

		<!-- Info -->
		<div class="mt-4 text-xs text-gray-500 space-y-1">
			<p><strong>RMS:</strong> Root Mean Square normalization</p>
			<p><strong>EBU:</strong> EBU R128 standard (recommended)</p>
			<p><strong>Peak:</strong> Peak amplitude normalization</p>
		</div>
	</div>
</template>
