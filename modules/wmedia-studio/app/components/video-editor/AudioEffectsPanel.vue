<script setup lang="ts">
import { defaultEffects, type AudioEffect, type AudioEffectsSettings, effectIcons, presetNames } from "~/composables/useVideoAudioEffects";
import AudioEffectReverb from "./effects/AudioEffectReverb.vue";
import AudioEffectDelay from "./effects/AudioEffectDelay.vue";
import AudioEffectEQ from "./effects/AudioEffectEQ.vue";
import AudioEffectCompressor from "./effects/AudioEffectCompressor.vue";
import AudioEffectLimiter from "./effects/AudioEffectLimiter.vue";
import AudioEffectChorus from "./effects/AudioEffectChorus.vue";
import AudioEffectDistortion from "./effects/AudioEffectDistortion.vue";

const emit = defineEmits<{
	close: [];
	apply: [settings: AudioEffectsSettings];
}>();

const effects = ref<AudioEffect[]>(JSON.parse(JSON.stringify(defaultEffects)));
const selectedEffectId = ref<string | null>(null);
const isProcessing = ref(false);
const bypassAll = ref(false);

const selectedEffect = computed(() =>
	effects.value.find((e) => e.id === selectedEffectId.value)
);

const toggleEffect = (id: string) => {
	const effect = effects.value.find((e) => e.id === id);
	if (effect) {
		effect.enabled = !effect.enabled;
		if (effect.enabled && !selectedEffectId.value) {
			selectedEffectId.value = id;
		}
	}
};

const selectEffect = (id: string) => {
	selectedEffectId.value = id;
};

const getEffectIcon = (type: AudioEffect["type"]): string => {
	return effectIcons[type] ?? "i-ph-sliders";
};

const handleApply = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("apply", {
			effects: effects.value,
			masterChain: !bypassAll.value,
		});
	}, 500);
};

const resetAll = () => {
	effects.value.forEach((effect) => {
		effect.enabled = false;
	});
	selectedEffectId.value = null;
};

const loadPreset = (presetName: string) => {
	import("~/composables/useVideoAudioEffects").then(({ effectPresets }) => {
		const preset = effectPresets[presetName];
		if (preset) {
			effects.value.forEach((effect) => {
				const presetEffect = preset.find((pe) => pe.id === effect.id);
				if (presetEffect) {
					effect.enabled = presetEffect.enabled ?? false;
					if (presetEffect.params) {
						Object.assign(effect.params, presetEffect.params);
					}
				}
			});
		}
	});
};

const effectComponents: Record<string, Component> = {
	reverb: AudioEffectReverb,
	delay: AudioEffectDelay,
	eq: AudioEffectEQ,
	compression: AudioEffectCompressor,
	limiter: AudioEffectLimiter,
	chorus: AudioEffectChorus,
	distortion: AudioEffectDistortion,
};
</script>

<template>
	<div class="audio-effects-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[480px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:tune" class="w-5 h-5 text-blue-500" />
				Audio Effects
			</h3>
			<div class="flex items-center gap-2">
				<button
					class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
					@click="resetAll"
				>
					Reset All
				</button>
				<button
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Bypass Toggle -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<span class="text-gray-900 dark:text-white text-sm font-medium">Bypass All Effects</span>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="bypassAll ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="bypassAll = !bypassAll"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="bypassAll ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<div class="flex gap-4 flex-1 overflow-hidden">
			<!-- Effects List -->
			<div class="w-1/3 flex flex-col gap-2 overflow-y-auto">
				<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">EFFECT CHAIN</div>
				<button
					v-for="effect in effects"
					:key="effect.id"
					class="flex items-center gap-2 p-2 rounded-lg text-left transition-all"
					:class="[
						selectedEffectId === effect.id
							? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
							: 'bg-gray-100 dark:bg-gray-700 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600',
						effect.enabled && !bypassAll ? 'opacity-100' : 'opacity-50',
					]"
					@click="selectEffect(effect.id)"
				>
					<span :class="getEffectIcon(effect.type)" class="w-4 h-4" />
					<div class="flex-1 min-w-0">
						<div
							class="text-sm font-medium truncate"
							:class="effect.enabled && !bypassAll ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'"
						>
							{{ effect.name }}
						</div>
					</div>
					<button
						class="w-6 h-6 rounded flex items-center justify-center transition-colors"
						:class="effect.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'"
						@click.stop="toggleEffect(effect.id)"
					>
						<Icon name="mdi:power" class="w-3 h-3" />
					</button>
				</button>
			</div>

			<!-- Effect Parameters -->
			<div class="flex-1 flex flex-col overflow-y-auto">
				<div v-if="selectedEffect" class="space-y-4">
					<div class="flex items-center gap-2 mb-3">
						<span :class="getEffectIcon(selectedEffect.type)" class="w-5 h-5 text-blue-500" />
						<h4 class="text-gray-900 dark:text-white font-medium">{{ selectedEffect.name }} Settings</h4>
					</div>

					<component :is="effectComponents[selectedEffect.type]" :params="selectedEffect.params" />
				</div>

				<div v-else class="flex-1 flex items-center justify-center text-gray-400">
					<div class="text-center">
						<Icon name="mdi:tune" class="w-12 h-12 mb-2 opacity-30" />
						<p class="text-sm">Select an effect to edit</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Presets -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">PRESETS</div>
			<div class="flex gap-2 flex-wrap">
				<button
					v-for="preset in presetNames"
					:key="preset"
					class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
					@click="loadPreset(preset)"
				>
					{{ preset }}
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="isProcessing || bypassAll"
				@click="handleApply"
			>
				<Icon v-if="isProcessing" name="mdi:loading" class="w-4 h-4 animate-spin" />
				<Icon v-else name="mdi:check" class="w-4 h-4" />
				Apply Effects
			</button>
		</div>
	</div>
</template>
