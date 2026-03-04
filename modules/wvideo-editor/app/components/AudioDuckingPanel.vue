<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: AudioDuckingSettings];
}>();

interface AudioDuckingSettings {
	enabled: boolean;
	threshold: number;
	reduction: number;
	attack: number;
	release: number;
	priorityTrack: string | null;
}

const settings = ref<AudioDuckingSettings>({
	enabled: true,
	threshold: -20,
	reduction: -12,
	attack: 50,
	release: 300,
	priorityTrack: null,
});

const tracks = ref([
	{ id: "1", name: "Voiceover", type: "voice" },
	{ id: "2", name: "Background Music", type: "music" },
	{ id: "3", name: "Sound Effects", type: "sfx" },
]);

const isProcessing = ref(false);
const previewActive = ref(false);

const handleApply = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("apply", settings.value);
	}, 500);
};

const togglePreview = () => {
	previewActive.value = !previewActive.value;
};

const presets = [
	{
		name: "Voiceover Focus",
		threshold: -20,
		reduction: -15,
		attack: 30,
		release: 250,
	},
	{ name: "Podcast", threshold: -18, reduction: -10, attack: 40, release: 200 },
	{
		name: "Dramatic",
		threshold: -25,
		reduction: -20,
		attack: 20,
		release: 400,
	},
];

const loadPreset = (preset: typeof presets[0]) => {
	settings.value.threshold = preset.threshold;
	settings.value.reduction = preset.reduction;
	settings.value.attack = preset.attack;
	settings.value.release = preset.release;
};
</script>

<template>
	<div class="audio-ducking-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[420px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:volume-high" class="w-5 h-5 text-blue-500" />
				Audio Ducking
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Enable Toggle -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<span class="text-gray-900 dark:text-white text-sm font-medium"
			>Enable Audio Ducking</span>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="settings.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="settings.enabled = !settings.enabled"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="settings.enabled ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<!-- Priority Track -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Priority Track (Trigger)</label>
			<select
				v-model="settings.priorityTrack"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="">Select track...</option>
				<option v-for="track in tracks" :key="track.id" :value="track.id">
					{{ track.name }} ({{ track.type }})
				</option>
			</select>
		</div>

		<!-- Threshold -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Threshold</label>
				<span class="text-blue-500 text-sm font-mono">{{ settings.threshold }}
					dB</span>
			</div>
			<input
				v-model="settings.threshold"
				type="range"
				min="-60"
				max="0"
				step="1"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span>-60 dB</span>
				<span>0 dB</span>
			</div>
		</div>

		<!-- Reduction -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Reduction Amount</label>
				<span class="text-blue-500 text-sm font-mono">{{ settings.reduction }}
					dB</span>
			</div>
			<input
				v-model="settings.reduction"
				type="range"
				min="-30"
				max="0"
				step="1"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Attack & Release -->
		<div class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-700 dark:text-gray-300 text-sm">Attack</label>
					<span class="text-blue-500 text-sm font-mono">{{
							settings.attack
						}}ms</span>
				</div>
				<input
					v-model="settings.attack"
					type="range"
					min="1"
					max="500"
					step="1"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				>
			</div>
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-700 dark:text-gray-300 text-sm"
					>Release</label>
					<span class="text-blue-500 text-sm font-mono">{{
							settings.release
						}}ms</span>
				</div>
				<input
					v-model="settings.release"
					type="range"
					min="10"
					max="1000"
					step="10"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				>
			</div>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Presets</label>
			<div class="flex gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
					@click="loadPreset(preset)"
				>
					{{ preset.name }}
				</button>
			</div>
		</div>

		<!-- Visualizer Placeholder -->
		<div class="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-500 dark:text-gray-400 text-xs"
				>Ducking Visualization</span>
				<button
					class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs rounded transition-colors"
					@click="togglePreview"
				>
					{{ previewActive ? "Stop" : "Preview" }}
				</button>
			</div>
			<div class="h-16 bg-white dark:bg-gray-800 rounded flex items-end justify-center gap-1 p-2">
				<div
					v-for="i in 20"
					:key="i"
					class="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm transition-all"
					:style="{ height: previewActive ? `${20 + Math.random() * 60}%` : '10%' }"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="isProcessing || !settings.enabled"
				@click="handleApply"
			>
				<Icon
					v-if="isProcessing"
					name="mdi:loading"
					class="w-4 h-4 animate-spin"
				/>
				<Icon v-else name="mdi:check" class="w-4 h-4" />
				Apply Ducking
			</button>
		</div>
	</div>
</template>
