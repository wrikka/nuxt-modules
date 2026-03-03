<script setup lang="ts">
const inputDevice = ref("default");
const inputGain = ref(0);
const monitorEnabled = ref(false);
const lowLatency = ref(true);
const inputLevel = ref(-60);
const peakLevel = ref(-60);

const devices = [
	{ id: "default", name: "Default Microphone" },
	{ id: "mic1", name: "USB Audio Interface" },
	{ id: "mic2", name: "Built-in Microphone" },
	{ id: "line1", name: "Line Input 1" },
	{ id: "line2", name: "Line Input 2" },
];

const inputLatency = computed(() => {
	return lowLatency.value ? "5.8ms" : "23ms";
});

// Simulate input level meter
let levelInterval: NodeJS.Timeout;
onMounted(() => {
	levelInterval = setInterval(() => {
		if (monitorEnabled.value) {
			inputLevel.value = -60 + Math.random() * 40;
			peakLevel.value = Math.max(peakLevel.value, inputLevel.value);
		} else {
			inputLevel.value = -60;
		}
	}, 50);
});

onUnmounted(() => {
	clearInterval(levelInterval);
});

const toggleMonitoring = () => {
	monitorEnabled.value = !monitorEnabled.value;
};

const resetPeak = () => {
	peakLevel.value = -60;
};

const getLevelColor = (db: number): string => {
	if (db > -6) return "bg-red-500";
	if (db > -12) return "bg-yellow-500";
	return "bg-green-500";
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
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/>
				</svg>
				Live Input Monitoring
			</h3>
			<button
				@click="toggleMonitoring"
				:class="[
					'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
					monitorEnabled
						? 'bg-green-600 text-white'
						: 'bg-gray-700 text-gray-400',
				]"
			>
				{{ monitorEnabled ? "ON" : "OFF" }}
			</button>
		</div>

		<div class="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
			<p class="text-xs text-yellow-300">
				Real-time input monitoring with low latency. Enable to hear yourself
				through headphones while recording.
			</p>
		</div>

		<!-- Input Device -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Input Device</label>
			<select
				v-model="inputDevice"
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option v-for="device in devices" :key="device.id" :value="device.id">
					{{ device.name }}
				</option>
			</select>
		</div>

		<!-- Input Level Meter -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<label class="text-sm text-gray-400">Input Level</label>
				<button
					@click="resetPeak"
					class="text-xs text-gray-500 hover:text-gray-300"
				>
					Reset Peak
				</button>
			</div>

			<div class="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
				<!-- Scale markers -->
				<div class="absolute inset-0 flex items-center justify-between px-2">
					<span class="text-xs text-gray-600">-60</span>
					<span class="text-xs text-gray-600">-30</span>
					<span class="text-xs text-gray-600">-12</span>
					<span class="text-xs text-gray-600">-6</span>
					<span class="text-xs text-gray-600">0</span>
				</div>

				<!-- Level bar -->
				<div
					class="absolute left-0 top-0 bottom-0 transition-all duration-75 rounded-r"
					:class="getLevelColor(inputLevel)"
					:style="{ width: `${Math.max(0, (inputLevel + 60) / 60 * 100)}%` }"
				>
				</div>

				<!-- Peak indicator -->
				<div
					class="absolute top-0 bottom-0 w-0.5 bg-white transition-all duration-150"
					:style="{ left: `${Math.max(0, (peakLevel + 60) / 60 * 100)}%` }"
				>
				</div>
			</div>

			<div class="flex justify-between text-xs">
				<span class="text-gray-500">RMS: {{ inputLevel.toFixed(1) }} dB</span>
				<span class="text-gray-500">Peak: {{ peakLevel.toFixed(1) }} dB</span>
			</div>
		</div>

		<!-- Input Gain -->
		<div class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-gray-400">Input Gain</span>
				<span class="text-white">{{ inputGain > 0 ? "+" : "" }}{{ inputGain }}
					dB</span>
			</div>
			<div class="flex items-center gap-2">
				<button
					@click="inputGain -= 6"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					-6dB
				</button>
				<input
					v-model="inputGain"
					type="range"
					min="-24"
					max="24"
					class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<button
					@click="inputGain += 6"
					class="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
				>
					+6dB
				</button>
			</div>
		</div>

		<!-- Latency Mode -->
		<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
			<div>
				<div class="text-sm text-gray-300">Low Latency Mode</div>
				<div class="text-xs text-gray-500">Current: {{ inputLatency }}</div>
			</div>
			<button
				@click="lowLatency = !lowLatency"
				:class="[
					'w-12 h-6 rounded-full transition-colors relative',
					lowLatency ? 'bg-purple-600' : 'bg-gray-700',
				]"
			>
				<span
					:class="[
						'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
						lowLatency ? 'left-7' : 'left-1',
					]"
				></span>
			</button>
		</div>

		<!-- Clip Warning -->
		<div
			v-if="peakLevel > -0.5"
			class="p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-red-400"
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
			<span class="text-sm text-red-400"
			>Input clipping detected! Reduce gain.</span>
		</div>
	</div>
</template>
