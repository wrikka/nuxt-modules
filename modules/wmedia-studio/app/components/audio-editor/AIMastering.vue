<script setup lang="ts">
import type { MasteringSettings } from "#shared/types/audio";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	master: [settings: MasteringSettings];
	preview: [settings: MasteringSettings];
}>();

const isProcessing = ref(false);
const isPreviewing = ref(false);

const settings = ref<MasteringSettings>({
	targetLoudness: -14,
	maxTruePeak: -1,
	stereoWidth: 100,
	bassEnhancement: 0,
	presenceBoost: 0,
});

const presets = [
	{
		name: "Streaming",
		targetLoudness: -14,
		stereoWidth: 100,
		bassEnhancement: 0,
		presenceBoost: 2,
	},
	{
		name: "CD/Master",
		targetLoudness: -16,
		stereoWidth: 120,
		bassEnhancement: 1,
		presenceBoost: 1,
	},
	{
		name: "Broadcast",
		targetLoudness: -23,
		stereoWidth: 100,
		bassEnhancement: 0,
		presenceBoost: 0,
	},
	{
		name: "Aggressive",
		targetLoudness: -9,
		stereoWidth: 140,
		bassEnhancement: 3,
		presenceBoost: 4,
	},
	{
		name: "Warm",
		targetLoudness: -16,
		stereoWidth: 80,
		bassEnhancement: 4,
		presenceBoost: -1,
	},
];

const applyPreset = (preset: typeof presets[0]) => {
	settings.value = {
		...settings.value,
		targetLoudness: preset.targetLoudness,
		stereoWidth: preset.stereoWidth,
		bassEnhancement: preset.bassEnhancement,
		presenceBoost: preset.presenceBoost,
	};
};

const startMastering = async () => {
	if (!props.audioBuffer) return;

	isProcessing.value = true;

	// Simulate processing
	await new Promise(resolve => setTimeout(resolve, 2000));

	emit("master", settings.value);
	isProcessing.value = false;
};

const previewMastering = async () => {
	if (!props.audioBuffer) return;

	isPreviewing.value = true;
	emit("preview", settings.value);

	// Preview for 5 seconds
	await new Promise(resolve => setTimeout(resolve, 5000));
	isPreviewing.value = false;
};

const resetSettings = () => {
	settings.value = {
		targetLoudness: -14,
		maxTruePeak: -1,
		stereoWidth: 100,
		bassEnhancement: 0,
		presenceBoost: 0,
	};
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">AI Mastering</span>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Quick Presets</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					@click="applyPreset(preset)"
					class="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
				>
					{{ preset.name }}
				</button>
			</div>
		</div>

		<!-- Controls -->
		<div class="space-y-4 mb-4">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Target Loudness</span>
					<span class="text-gray-300">{{ settings.targetLoudness }} LUFS</span>
				</div>
				<input
					v-model.number="settings.targetLoudness"
					type="range"
					min="-23"
					max="-8"
					step="0.5"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Max True Peak</span>
					<span class="text-gray-300">{{ settings.maxTruePeak }} dBTP</span>
				</div>
				<input
					v-model.number="settings.maxTruePeak"
					type="range"
					min="-6"
					max="-0.1"
					step="0.1"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Stereo Width</span>
					<span class="text-gray-300">{{ settings.stereoWidth }}%</span>
				</div>
				<input
					v-model.number="settings.stereoWidth"
					type="range"
					min="0"
					max="150"
					step="5"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Bass Enhancement</span>
					<span class="text-gray-300">{{ settings.bassEnhancement }}dB</span>
				</div>
				<input
					v-model.number="settings.bassEnhancement"
					type="range"
					min="0"
					max="6"
					step="0.5"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Presence Boost</span>
					<span class="text-gray-300">{{ settings.presenceBoost }}dB</span>
				</div>
				<input
					v-model.number="settings.presenceBoost"
					type="range"
					min="-3"
					max="6"
					step="0.5"
					class="w-full accent-blue-500"
				>
			</div>
		</div>

		<!-- Processing Chain -->
		<div class="bg-gray-800 rounded p-3 mb-4">
			<div class="text-xs text-gray-400 mb-2">Processing Chain</div>
			<div class="flex items-center gap-1 text-xs">
				<span class="px-2 py-1 bg-gray-700 rounded text-gray-300">EQ</span>
				<span class="text-gray-600">→</span>
				<span class="px-2 py-1 bg-gray-700 rounded text-gray-300"
				>Compressor</span>
				<span class="text-gray-600">→</span>
				<span class="px-2 py-1 bg-gray-700 rounded text-gray-300"
				>Stereo Widener</span>
				<span class="text-gray-600">→</span>
				<span class="px-2 py-1 bg-gray-700 rounded text-gray-300">Limiter</span>
				<span class="text-gray-600">→</span>
				<span class="px-2 py-1 bg-gray-700 rounded text-gray-300"
				>Maximizer</span>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				@click="startMastering"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				{{ isProcessing ? "Mastering..." : "Apply Mastering" }}
			</button>
			<button
				@click="previewMastering"
				:disabled="!audioBuffer || isPreviewing || isProcessing"
				class="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				{{ isPreviewing ? "Previewing..." : "Preview" }}
			</button>
			<button
				@click="resetSettings"
				class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors"
			>
				Reset
			</button>
		</div>

		<p class="mt-3 text-xs text-gray-500">
			AI mastering applies professional-grade processing to achieve optimal
			loudness and clarity for your target platform.
		</p>
	</div>
</template>
