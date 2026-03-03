<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: StabilizationSettings];
}>();

interface StabilizationSettings {
	enabled: boolean;
	strength: number;
	smoothness: number;
	crop: number;
	rollingShutter: boolean;
}

const settings = ref<StabilizationSettings>({
	enabled: true,
	strength: 50,
	smoothness: 30,
	crop: 10,
	rollingShutter: false,
});

const isAnalyzing = ref(false);
const analysisProgress = ref(0);
const motionData = ref<number[]>([]);

const presets = [
	{ name: "Smooth Walk", strength: 40, smoothness: 50 },
	{ name: "Action Cam", strength: 80, smoothness: 20 },
	{ name: "Subtle", strength: 25, smoothness: 40 },
];

const loadPreset = (preset: typeof presets[0]) => {
	settings.value.strength = preset.strength;
	settings.value.smoothness = preset.smoothness;
};

const analyzeMotion = async () => {
	isAnalyzing.value = true;
	analysisProgress.value = 0;
	motionData.value = [];

	// Simulate analysis
	const interval = setInterval(() => {
		analysisProgress.value += 5;
		motionData.value.push(Math.random() * 100);
		if (motionData.value.length > 50) motionData.value.shift();

		if (analysisProgress.value >= 100) {
			clearInterval(interval);
			isAnalyzing.value = false;
		}
	}, 100);
};

const handleApply = () => {
	emit("apply", settings.value);
};
</script>

<template>
	<div class="stabilization-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:crosshairs" class="w-5 h-5 text-blue-500" />
				Video Stabilization
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
			>Enable Stabilization</span>
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

		<!-- Presets -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Presets</label>
			<div class="flex gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="flex-1 px-2 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
					@click="loadPreset(preset)"
				>
					<div class="font-medium">{{ preset.name }}</div>
					<div class="text-gray-500 dark:text-gray-400 mt-0.5">
						{{ preset.strength }}%
					</div>
				</button>
			</div>
		</div>

		<!-- Strength -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Stabilization Strength</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.strength
					}}%</span>
			</div>
			<input
				v-model="settings.strength"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Smoothness -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Smoothness</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.smoothness
					}}%</span>
			</div>
			<input
				v-model="settings.smoothness"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Crop -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Crop Amount</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.crop
					}}%</span>
			</div>
			<input
				v-model="settings.crop"
				type="range"
				min="0"
				max="30"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
			<p class="text-gray-500 text-xs mt-1">
				Higher crop allows more stabilization room
			</p>
		</div>

		<!-- Rolling Shutter -->
		<div class="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<input
				id="rolling-shutter"
				v-model="settings.rollingShutter"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
			>
			<label
				for="rolling-shutter"
				class="text-gray-700 dark:text-gray-300 text-sm"
			>Correct Rolling Shutter</label>
		</div>

		<!-- Motion Analysis -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Motion Analysis</label>
				<button
					class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded transition-colors"
					:disabled="isAnalyzing"
					@click="analyzeMotion"
				>
					<Icon
						v-if="isAnalyzing"
						name="mdi:loading"
						class="w-3 h-3 animate-spin"
					/>
					{{ isAnalyzing ? "Analyzing..." : "Analyze" }}
				</button>
			</div>

			<!-- Progress -->
			<div v-if="isAnalyzing" class="mb-2">
				<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-500 rounded-full transition-all duration-100"
						:style="{ width: `${analysisProgress}%` }"
					/>
				</div>
			</div>

			<!-- Motion Graph -->
			<div class="h-24 bg-gray-100 dark:bg-gray-900 rounded-lg p-2">
				<svg class="w-full h-full">
					<path
						v-if="motionData.length > 1"
						:path="`M ${
							motionData.map((d, i) =>
								`${(i / motionData.length) * 100},${100 - d}`
							).join(' L ')
						}`"
						fill="none"
						stroke="#3b82f6"
						stroke-width="2"
					/>
					<text
						v-else
						x="50%"
						y="50%"
						fill="#6b7280"
						text-anchor="middle"
						font-size="12"
					>
						Click Analyze to detect motion
					</text>
				</svg>
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
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="handleApply"
			>
				Apply Stabilization
			</button>
		</div>
	</div>
</template>
