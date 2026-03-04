<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const activeTab = ref<"denoise" | "declick" | "dehum" | "dereverb">("denoise");
const isProcessing = ref(false);
const processingProgress = ref(0);

// De-noise settings
const noiseReductionStrength = ref(50);
const noiseProfile = ref<"auto" | "voice" | "music" | "hiss">("auto");

// De-click/pop settings
const clickSensitivity = ref(70);
const crackleReduction = ref(50);
const popThreshold = ref(-20);

// De-hum settings
const humFrequency = ref(50); // 50Hz or 60Hz
const humHarmonics = ref(true);
const humReduction = ref(80);

// De-reverb settings
const reverbReduction = ref(60);
const roomSize = ref<"small" | "medium" | "large">("medium");
const earlyReflections = ref(true);

const tabs = [
	{ id: "denoise", label: "De-noise", icon: "wave-square" },
	{ id: "declick", label: "De-click", icon: "lightning-bolt" },
	{ id: "dehum", label: "De-hum", icon: "volume-off" },
	{ id: "dereverb", label: "De-reverb", icon: "home" },
];

const processAudio = async () => {
	if (!props.audioBuffer) return;

	isProcessing.value = true;
	processingProgress.value = 0;

	// Simulate AI processing
	const interval = setInterval(() => {
		processingProgress.value += 5;
		if (processingProgress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
		}
	}, 100);
};

const previewEffect = () => {
	console.log("Previewing", activeTab.value, "effect");
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
						d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
					/>
				</svg>
				AI Audio Restoration
			</h3>
		</div>

		<!-- Tabs -->
		<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				@click="activeTab = tab.id as 'denoise' | 'declick' | 'dehum' | 'dereverb'"
				:class="[
					'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2',
					activeTab === tab.id
						? 'bg-purple-600 text-white'
						: 'text-gray-400 hover:text-white hover:bg-gray-700',
				]"
			>
				<svg
					v-if="tab.icon === 'wave-square'"
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
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				<svg
					v-else-if="tab.icon === 'lightning-bolt'"
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
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<svg
					v-else-if="tab.icon === 'volume-off'"
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
						d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
					/>
				</svg>
				<svg
					v-else
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
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				{{ tab.label }}
			</button>
		</div>

		<!-- De-noise Panel -->
		<div v-if="activeTab === 'denoise'" class="space-y-4">
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Noise Profile</label>
				<select
					v-model="noiseProfile"
					class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
				>
					<option value="auto">Auto Detect</option>
					<option value="voice">Voice Recording</option>
					<option value="music">Music Production</option>
					<option value="hiss">Tape Hiss</option>
				</select>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Reduction Strength</label>
					<span class="text-xs text-white">{{ noiseReductionStrength }}%</span>
				</div>
				<input
					v-model="noiseReductionStrength"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
				<div class="flex justify-between text-xs text-gray-500">
					<span>Subtle</span>
					<span>Aggressive</span>
				</div>
			</div>

			<div class="p-3 bg-gray-800 rounded-lg">
				<p class="text-xs text-gray-400">
					AI will analyze noise profile and remove unwanted background noise
					while preserving audio quality.
				</p>
			</div>
		</div>

		<!-- De-click Panel -->
		<div v-if="activeTab === 'declick'" class="space-y-4">
			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Click/Pop Sensitivity</label>
					<span class="text-xs text-white">{{ clickSensitivity }}%</span>
				</div>
				<input
					v-model="clickSensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Crackle Reduction</label>
					<span class="text-xs text-white">{{ crackleReduction }}%</span>
				</div>
				<input
					v-model="crackleReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Pop Threshold (dB)</label>
					<span class="text-xs text-white">{{ popThreshold }}dB</span>
				</div>
				<input
					v-model="popThreshold"
					type="range"
					min="-60"
					max="-10"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- De-hum Panel -->
		<div v-if="activeTab === 'dehum'" class="space-y-4">
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Hum Frequency</label>
				<div class="flex gap-2">
					<button
						@click="humFrequency = 50"
						:class="[
							'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
							humFrequency === 50
								? 'bg-purple-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
						]"
					>
						50 Hz (EU/Asia)
					</button>
					<button
						@click="humFrequency = 60"
						:class="[
							'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
							humFrequency === 60
								? 'bg-purple-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
						]"
					>
						60 Hz (US)
					</button>
				</div>
			</div>

			<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
				<span class="text-sm text-gray-300">Remove Harmonics</span>
				<button
					@click="humHarmonics = !humHarmonics"
					:class="[
						'w-12 h-6 rounded-full transition-colors relative',
						humHarmonics ? 'bg-purple-600' : 'bg-gray-700',
					]"
				>
					<span
						:class="[
							'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
							humHarmonics ? 'left-7' : 'left-1',
						]"
					></span>
				</button>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Reduction Amount</label>
					<span class="text-xs text-white">{{ humReduction }}%</span>
				</div>
				<input
					v-model="humReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- De-reverb Panel -->
		<div v-if="activeTab === 'dereverb'" class="space-y-4">
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Room Size</label>
				<div class="flex gap-2">
					<button
						v-for='size in ["small", "medium", "large"]'
						:key="size"
						@click="roomSize = size as 'small' | 'medium' | 'large'"
						:class="[
							'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
							roomSize === size
								? 'bg-purple-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
						]"
					>
						{{ size }}
					</button>
				</div>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between">
					<label class="text-xs text-gray-400">Reverb Reduction</label>
					<span class="text-xs text-white">{{ reverbReduction }}%</span>
				</div>
				<input
					v-model="reverbReduction"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
				<span class="text-sm text-gray-300">Remove Early Reflections</span>
				<button
					@click="earlyReflections = !earlyReflections"
					:class="[
						'w-12 h-6 rounded-full transition-colors relative',
						earlyReflections ? 'bg-purple-600' : 'bg-gray-700',
					]"
				>
					<span
						:class="[
							'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
							earlyReflections ? 'left-7' : 'left-1',
						]"
					></span>
				</button>
			</div>
		</div>

		<!-- Processing Progress -->
		<div v-if="isProcessing" class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-white">Processing...</span>
				<span class="text-purple-400">{{ processingProgress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-600 transition-all duration-100"
					:style="{ width: `${processingProgress}%` }"
				>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex gap-2">
			<button
				@click="previewEffect"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Preview
			</button>
			<button
				@click="processAudio"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				Apply
			</button>
		</div>
	</div>
</template>
