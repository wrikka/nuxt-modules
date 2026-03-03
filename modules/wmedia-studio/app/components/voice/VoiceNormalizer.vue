<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	normalize: [targetLUFS: number, truePeak: number];
}>();

const targetLUFS = ref(-14);
const truePeak = ref(-1);
const isAnalyzing = ref(false);
const currentStats = ref({ lufs: -23, peak: -3, dynamicRange: 12 });

const presets = [
	{
		name: "Streaming",
		lufs: -14,
		peak: -1,
		desc: "Spotify, YouTube, Apple Music",
	},
	{ name: "Broadcast", lufs: -23, peak: -6, desc: "TV, Radio standard" },
	{ name: "Podcast", lufs: -16, peak: -1, desc: "Voice optimized" },
	{ name: "CD Master", lufs: -9, peak: -0.1, desc: "Maximum loudness" },
];

const applyPreset = (preset: typeof presets[0]) => {
	targetLUFS.value = preset.lufs;
	truePeak.value = preset.peak;
};

const analyze = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
		currentStats.value = {
			lufs: -18 + Math.random() * 10,
			peak: -6 + Math.random() * 5,
			dynamicRange: 8 + Math.random() * 8,
		};
	}, 1000);
};

const normalize = () => {
	emit("normalize", targetLUFS.value, truePeak.value);
};
</script>

<template>
	<div class="voice-normalizer bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-wave-sine" class="w-5 h-5" />
				Audio Normalizer
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Current Stats -->
		<div class="mb-4 p-3 bg-gray-700/30 rounded-lg">
			<div class="text-gray-400 text-xs mb-2">Current Levels</div>
			<div class="grid grid-cols-3 gap-2 text-center">
				<div>
					<div
						class="text-xl font-bold"
						:class="currentStats.lufs > targetLUFS
						? 'text-green-400'
						: 'text-yellow-400'"
					>
						{{ currentStats.lufs.toFixed(1) }}
					</div>
					<div class="text-gray-500 text-xs">LUFS</div>
				</div>
				<div>
					<div class="text-xl font-bold text-blue-400">
						{{ currentStats.peak.toFixed(1) }}
					</div>
					<div class="text-gray-500 text-xs">dB Peak</div>
				</div>
				<div>
					<div class="text-xl font-bold text-purple-400">
						{{ currentStats.dynamicRange.toFixed(1) }}
					</div>
					<div class="text-gray-500 text-xs">DR</div>
				</div>
			</div>
			<button
				class="w-full mt-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs"
				@click="analyze"
			>
				<Icon
					:name="isAnalyzing ? 'i-ph-spinner' : 'i-ph-arrows-clockwise'"
					class="w-3 h-3 inline mr-1"
					:class="isAnalyzing && 'animate-spin'"
				/>
				Analyze
			</button>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Presets</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors"
					@click="applyPreset(preset)"
				>
					<div class="text-white text-sm font-medium">{{ preset.name }}</div>
					<div class="text-gray-500 text-xs">{{ preset.desc }}</div>
				</button>
			</div>
		</div>

		<!-- Settings -->
		<div class="mb-4 space-y-3">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Target LUFS</span>
					<span class="text-blue-400 font-mono">{{ targetLUFS }} LUFS</span>
				</div>
				<input
					v-model="targetLUFS"
					type="range"
					min="-23"
					max="-9"
					step="0.5"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">True Peak Limit</span>
					<span class="text-blue-400 font-mono">{{ truePeak }} dB</span>
				</div>
				<input
					v-model="truePeak"
					type="range"
					min="-6"
					max="-0.1"
					step="0.1"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
				@click="normalize"
			>
				Normalize
			</button>
		</div>
	</div>
</template>
