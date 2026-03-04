<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const noiseLevel = defineModel<number>("noiseLevel", { default: 50 });
const enhanceLevel = defineModel<number>("enhanceLevel", { default: 30 });
const autoGain = defineModel<boolean>("autoGain", { default: true });
const suppressKeyboard = defineModel<boolean>("suppressKeyboard", {
	default: true,
});
const suppressMouse = defineModel<boolean>("suppressMouse", { default: true });

const presets = [
	{
		id: "default",
		name: "Default",
		icon: "mdi:restore",
		noise: 50,
		enhance: 30,
	},
	{
		id: "aggressive",
		name: "Aggressive",
		icon: "mdi:filter-remove",
		noise: 80,
		enhance: 50,
	},
	{
		id: "light",
		name: "Light Touch",
		icon: "mdi:feather",
		noise: 30,
		enhance: 15,
	},
	{
		id: "voice",
		name: "Voice Focus",
		icon: "mdi:microphone-variant",
		noise: 60,
		enhance: 40,
		agc: true,
	},
	{
		id: "music",
		name: "Music",
		icon: "mdi:music",
		noise: 20,
		enhance: 10,
		agc: false,
	},
];

const applyPreset = (preset: typeof presets[0]) => {
	noiseLevel.value = preset.noise;
	enhanceLevel.value = preset.enhance;
	if (preset.agc !== undefined) {
		autoGain.value = preset.agc;
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Noise Suppression
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<!-- Presets -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="preset in presets"
					:key="preset.id"
					class="p-2 rounded-lg border text-center transition-all hover:border-purple-300"
					@click="applyPreset(preset)"
				>
					<Icon
						:name="preset.icon"
						class="w-5 h-5 mx-auto mb-1 text-gray-500"
					/>
					<p class="text-xs text-gray-700 dark:text-gray-300">
						{{ preset.name }}
					</p>
				</button>
			</div>

			<!-- Sliders -->
			<div class="space-y-3">
				<div>
					<div class="flex justify-between">
						<label class="text-xs text-gray-600 dark:text-gray-400"
						>Noise Reduction</label>
						<span class="text-xs text-gray-500">{{ noiseLevel }}%</span>
					</div>
					<input
						v-model.number="noiseLevel"
						type="range"
						min="0"
						max="100"
						class="w-full"
					/>
				</div>
				<div>
					<div class="flex justify-between">
						<label class="text-xs text-gray-600 dark:text-gray-400"
						>Voice Enhancement</label>
						<span class="text-xs text-gray-500">{{ enhanceLevel }}%</span>
					</div>
					<input
						v-model.number="enhanceLevel"
						type="range"
						min="0"
						max="100"
						class="w-full"
					/>
				</div>
			</div>

			<!-- Options -->
			<div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
				<label class="flex items-center gap-2">
					<input
						v-model="autoGain"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Auto Gain Control</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						v-model="suppressKeyboard"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Suppress Keyboard Sounds</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						v-model="suppressMouse"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Suppress Mouse Clicks</span>
				</label>
			</div>

			<!-- Visualizer Placeholder -->
			<div class="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center gap-1">
				<div
					v-for="i in 20"
					:key="i"
					class="w-1 bg-purple-500 rounded-full"
					:style="{ height: `${20 + Math.random() * 60}%` }"
				/>
			</div>
		</div>
	</div>
</template>
