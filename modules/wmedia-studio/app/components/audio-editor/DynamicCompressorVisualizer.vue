<script setup lang="ts">
const props = defineProps<{
	audioContext: AudioContext | null;
}>();

const threshold = ref(-20);
const ratio = ref(4);
const attack = ref(10);
const release = ref(100);
const makeupGain = ref(6);
const knee = ref(6);
const isActive = ref(false);

// Simulated gain reduction data
const gainReductionHistory = ref<number[]>(Array.from({ length: 50 }, () => 0));

const updateVisualization = () => {
	// Simulate gain reduction based on settings
	const reduction = Math.max(0, (threshold.value + 40) / 40 * ratio.value * 2);
	gainReductionHistory.value.shift();
	gainReductionHistory.value.push(reduction * (0.5 + Math.random() * 0.5));
};

let interval: NodeJS.Timeout;
onMounted(() => {
	interval = setInterval(updateVisualization, 50);
});

onUnmounted(() => {
	clearInterval(interval);
});

const getCompressionCurve = (input: number): number => {
	const thresholdLinear = Math.pow(10, threshold.value / 20);
	const ratioVal = ratio.value;

	if (input < thresholdLinear) {
		return input;
	}

	const excess = input - thresholdLinear;
	const compressed = thresholdLinear + excess / ratioVal;
	return compressed;
};

const toggleCompressor = () => {
	isActive.value = !isActive.value;
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
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/>
				</svg>
				Dynamic Compressor
			</h3>
			<button
				@click="toggleCompressor"
				:class="[
					'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
					isActive ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400',
				]"
			>
				{{ isActive ? "Active" : "Bypass" }}
			</button>
		</div>

		<!-- Visualization -->
		<div class="grid grid-cols-2 gap-3">
			<!-- Transfer Curve -->
			<div class="bg-gray-800 rounded-lg p-3">
				<div class="text-xs text-gray-400 mb-2">Transfer Curve</div>
				<div class="relative h-32 bg-gray-900 rounded">
					<svg
						class="w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<!-- Grid -->
						<defs>
							<pattern
								id="grid"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 20 0 L 0 0 0 20"
									fill="none"
									stroke="#374151"
									stroke-width="0.5"
								/>
							</pattern>
						</defs>
						<rect width="100" height="100" fill="url(#grid)" />

						<!-- Threshold line -->
						<line
							:x1="(threshold + 60) / 60 * 100"
							y1="0"
							:x2="(threshold + 60) / 60 * 100"
							y2="100"
							stroke="#9333ea"
							stroke-width="1"
							stroke-dasharray="4"
						/>

						<!-- Compression curve -->
						<polyline
							:points="Array.from({ length: 100 }, (_, i) => {
								const input = i;
								const inputDb = -60 + (i / 100) * 60;
								const output = getCompressionCurve(Math.pow(10, inputDb / 20));
								const outputDb = 20 * Math.log10(output || 0.001);
								const y = 100 - ((outputDb + 60) / 60 * 100);
								return `${input},${Math.max(0, Math.min(100, y))}`;
							}).join(' ')"
							fill="none"
							stroke="#a855f7"
							stroke-width="2"
						/>

						<!-- 1:1 line -->
						<line
							x1="0"
							y1="100"
							x2="100"
							y2="0"
							stroke="#4b5563"
							stroke-width="1"
							stroke-dasharray="2"
						/>
					</svg>
				</div>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>-60dB</span>
					<span>0dB</span>
				</div>
			</div>

			<!-- Gain Reduction Meter -->
			<div class="bg-gray-800 rounded-lg p-3">
				<div class="text-xs text-gray-400 mb-2">Gain Reduction (dB)</div>
				<div class="relative h-32 bg-gray-900 rounded flex items-end justify-center gap-0.5 px-2">
					<div
						v-for="(value, index) in gainReductionHistory"
						:key="index"
						class="w-1 rounded-t transition-all duration-75"
						:class="value > 5
						? 'bg-red-500'
						: value > 2
						? 'bg-yellow-500'
						: 'bg-green-500'"
						:style="{ height: `${(value / 20) * 100}%` }"
					>
					</div>
				</div>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>0dB</span>
					<span>-20dB</span>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid grid-cols-2 gap-3">
			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Threshold</label>
					<span class="text-xs text-white">{{ threshold }}dB</span>
				</div>
				<input
					v-model="threshold"
					type="range"
					min="-60"
					max="0"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Ratio</label>
					<span class="text-xs text-white">{{ ratio }}:1</span>
				</div>
				<input
					v-model="ratio"
					type="range"
					min="1"
					max="20"
					step="0.5"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Attack</label>
					<span class="text-xs text-white">{{ attack }}ms</span>
				</div>
				<input
					v-model="attack"
					type="range"
					min="0.1"
					max="100"
					step="0.1"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Release</label>
					<span class="text-xs text-white">{{ release }}ms</span>
				</div>
				<input
					v-model="release"
					type="range"
					min="10"
					max="1000"
					step="10"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Knee</label>
					<span class="text-xs text-white">{{ knee }}dB</span>
				</div>
				<input
					v-model="knee"
					type="range"
					min="0"
					max="20"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Makeup Gain</label>
					<span class="text-xs text-white">{{ makeupGain }}dB</span>
				</div>
				<input
					v-model="makeupGain"
					type="range"
					min="0"
					max="24"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>
	</div>
</template>
