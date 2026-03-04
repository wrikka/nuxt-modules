<script setup lang="ts">
const props = defineProps<{
	audioStream?: MediaStream | null;
}>();

const emit = defineEmits<{
	(e: "processed-stream", stream: MediaStream): void;
	(e: "enabled-change", enabled: boolean): void;
}>();

const { state, frequencyDataArray, timeDataArray, initialize, toggle, setNoiseLevel, setEnhanceLevel, setAutoGain, setSuppressKeyboard, setSuppressMouse, applyPreset, getAudioLevel, cleanup } = useNoiseSuppression({
	noiseLevel: 50,
	enhanceLevel: 30,
	autoGain: true,
	suppressKeyboard: true,
	suppressMouse: true,
});

const presets = [
	{ id: "default", name: "Default", icon: "mdi:restore", noise: 50, enhance: 30 },
	{ id: "aggressive", name: "Aggressive", icon: "mdi:filter-remove", noise: 80, enhance: 50 },
	{ id: "light", name: "Light Touch", icon: "mdi:feather", noise: 30, enhance: 15 },
	{ id: "voice", name: "Voice Focus", icon: "mdi:microphone-variant", noise: 60, enhance: 40 },
	{ id: "music", name: "Music", icon: "mdi:music", noise: 20, enhance: 10 },
];

const visualizerBars = ref<number[]>(new Array(20).fill(0));
let visualizerInterval: NodeJS.Timeout | null = null;

const handleToggle = async () => {
	if (!state.enabled && props.audioStream) {
		try {
			const processedStream = await initialize(props.audioStream);
			emit("processed-stream", processedStream);
		} catch (error) {
			console.error("Failed to initialize noise suppression:", error);
			return;
		}
	} else if (state.enabled) {
		cleanup();
	}

	toggle();
	emit("enabled-change", state.enabled);

	if (state.enabled) {
		startVisualizer();
	} else {
		stopVisualizer();
	}
};

const startVisualizer = () => {
	stopVisualizer();
	visualizerInterval = setInterval(() => {
		const level = getAudioLevel();
		visualizerBars.value = visualizerBars.value.map(() => 10 + Math.random() * level * 80);
	}, 50);
};

const stopVisualizer = () => {
	if (visualizerInterval) {
		clearInterval(visualizerInterval);
		visualizerInterval = null;
	}
	visualizerBars.value = new Array(20).fill(10);
};

const handlePresetClick = (preset: typeof presets[0]) => {
	applyPreset(preset.id);
};

watch(() => props.audioStream, (newStream) => {
	if (newStream && state.enabled) {
		void initialize(newStream);
	}
});

onUnmounted(() => {
	stopVisualizer();
	cleanup();
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg space-y-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<Icon name="mdi:waveform" class="w-5 h-5 text-purple-600" />
				Noise Suppression
			</h3>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					class="sr-only peer"
					:checked="state.enabled"
					@change="handleToggle"
				>
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
			</label>
		</div>

		<!-- Visualizer -->
		<div class="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center gap-0.5 px-4">
			<div
				v-for="(bar, i) in visualizerBars"
				:key="i"
				class="w-2 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full transition-all duration-75"
				:style="{ height: `${Math.max(4, bar)}%` }"
			/>
		</div>

		<div v-if="state.enabled" class="space-y-4">
			<!-- Presets -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="preset in presets"
						:key="preset.id"
						class="flex flex-col items-center p-2 rounded-lg border transition-all"
						:class="state.noiseLevel === preset.noise && state.enhanceLevel === preset.enhance ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
						@click="handlePresetClick(preset)"
					>
						<Icon :name="preset.icon" class="w-5 h-5 text-gray-500 mb-1" />
						<span class="text-xs text-gray-700 dark:text-gray-300">{{ preset.name }}</span>
					</button>
				</div>
			</div>

			<!-- Sliders -->
			<div class="space-y-3">
				<div>
					<div class="flex justify-between mb-1">
						<label class="text-xs text-gray-600 dark:text-gray-400">Noise Reduction</label>
						<span class="text-xs text-gray-500">{{ state.noiseLevel }}%</span>
					</div>
					<input
						v-model.number="state.noiseLevel"
						type="range"
						min="0"
						max="100"
						class="w-full"
						@input="setNoiseLevel(state.noiseLevel)"
					>
				</div>
				<div>
					<div class="flex justify-between mb-1">
						<label class="text-xs text-gray-600 dark:text-gray-400">Voice Enhancement</label>
						<span class="text-xs text-gray-500">{{ state.enhanceLevel }}%</span>
					</div>
					<input
						v-model.number="state.enhanceLevel"
						type="range"
						min="0"
						max="100"
						class="w-full"
						@input="setEnhanceLevel(state.enhanceLevel)"
					>
				</div>
			</div>

			<!-- Options -->
			<div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="state.autoGain"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
						@change="setAutoGain(state.autoGain)"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300">Auto Gain Control</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="state.suppressKeyboard"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
						@change="setSuppressKeyboard(state.suppressKeyboard)"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300">Suppress Keyboard Sounds</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="state.suppressMouse"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
						@change="setSuppressMouse(state.suppressMouse)"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300">Suppress Mouse Clicks</span>
				</label>
			</div>
		</div>

		<!-- Info -->
		<div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
			<Icon name="mdi:information" class="w-4 h-4 mt-0.5 flex-shrink-0" />
			<p>Uses Web Audio API filters to reduce background noise and enhance voice clarity.</p>
		</div>
	</div>
</template>
