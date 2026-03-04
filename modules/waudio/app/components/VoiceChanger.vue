<script setup lang="ts">
import type { VoiceEffect } from "#shared/types/audio";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	apply: [effect: VoiceEffect];
	preview: [effect: VoiceEffect];
}>();

const isProcessing = ref(false);
const isPreviewing = ref(false);

const params = ref({
	pitch: 0,
	formant: 0,
	robot: 0,
	whisper: 0,
});

const presets = [
	{ name: "Normal", pitch: 0, formant: 0, robot: 0, whisper: 0 },
	{ name: "Deep Voice", pitch: -8, formant: -4, robot: 0, whisper: 0 },
	{ name: "Chipmunk", pitch: 12, formant: 6, robot: 0, whisper: 0 },
	{ name: "Robot", pitch: 0, formant: 0, robot: 80, whisper: 0 },
	{ name: "Whisper", pitch: 0, formant: 0, robot: 0, whisper: 70 },
	{ name: "Monster", pitch: -12, formant: -8, robot: 20, whisper: 0 },
	{ name: "Helium", pitch: 16, formant: 8, robot: 0, whisper: 0 },
	{ name: "Radio DJ", pitch: -2, formant: 3, robot: 0, whisper: 0 },
];

const applyPreset = (preset: typeof presets[0]) => {
	params.value = {
		pitch: preset.pitch,
		formant: preset.formant,
		robot: preset.robot,
		whisper: preset.whisper,
	};
};

const applyEffect = async () => {
	if (!props.audioBuffer) return;

	isProcessing.value = true;

	const effect: VoiceEffect = {
		id: "voice-" + Date.now(),
		name: "Custom Voice Effect",
		params: { ...params.value },
	};

	await new Promise(resolve => setTimeout(resolve, 1500));
	emit("apply", effect);
	isProcessing.value = false;
};

const previewEffect = async () => {
	if (!props.audioBuffer) return;

	isPreviewing.value = true;

	const effect: VoiceEffect = {
		id: "preview-" + Date.now(),
		name: "Preview",
		params: { ...params.value },
	};

	emit("preview", effect);
	await new Promise(resolve => setTimeout(resolve, 3000));
	isPreviewing.value = false;
};

const resetParams = () => {
	params.value = { pitch: 0, formant: 0, robot: 0, whisper: 0 };
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Voice Changer</span>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Presets</label>
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
		<div class="space-y-3 mb-4">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Pitch Shift</span>
					<span class="text-gray-300">{{ params.pitch > 0 ? "+" : "" }}{{
							params.pitch
						}} semitones</span>
				</div>
				<input
					v-model.number="params.pitch"
					type="range"
					min="-24"
					max="24"
					step="1"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Formant Shift</span>
					<span class="text-gray-300">{{ params.formant > 0 ? "+" : "" }}{{
						params.formant
					}}</span>
				</div>
				<input
					v-model.number="params.formant"
					type="range"
					min="-12"
					max="12"
					step="1"
					class="w-full accent-blue-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Robot Effect</span>
					<span class="text-gray-300">{{ params.robot }}%</span>
				</div>
				<input
					v-model.number="params.robot"
					type="range"
					min="0"
					max="100"
					step="5"
					class="w-full accent-purple-500"
				>
			</div>

			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Whisper Effect</span>
					<span class="text-gray-300">{{ params.whisper }}%</span>
				</div>
				<input
					v-model.number="params.whisper"
					type="range"
					min="0"
					max="100"
					step="5"
					class="w-full accent-pink-500"
				>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				@click="applyEffect"
				:disabled="!audioBuffer || isProcessing"
				class="flex-1 px-3 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				{{ isProcessing ? "Processing..." : "Apply Effect" }}
			</button>
			<button
				@click="previewEffect"
				:disabled="!audioBuffer || isPreviewing || isProcessing"
				class="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				{{ isPreviewing ? "Previewing..." : "Preview" }}
			</button>
			<button
				@click="resetParams"
				class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors"
			>
				Reset
			</button>
		</div>

		<p class="mt-3 text-xs text-gray-500">
			Real-time voice modulation with pitch/formant shifting for creative voice
			effects.
		</p>
	</div>
</template>
