<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	detect: [threshold: number];
	applyCuts: [cuts: SceneCut[]];
}>();

interface SceneCut {
	time: number;
	confidence: number;
	frame: number;
}

const threshold = ref(30);
const isDetecting = ref(false);
const detectedCuts = ref<SceneCut[]>([]);
const detectionProgress = ref(0);
const selectedCuts = ref<string[]>([]);

const startDetection = async () => {
	isDetecting.value = true;
	detectionProgress.value = 0;
	detectedCuts.value = [];

	// Simulate scene detection
	const interval = setInterval(() => {
		detectionProgress.value += 10;

		if (detectionProgress.value % 20 === 0) {
			detectedCuts.value.push({
				time: detectionProgress.value / 2,
				confidence: 60 + Math.random() * 40,
				frame: Math.floor((detectionProgress.value / 2) * 30),
			});
		}

		if (detectionProgress.value >= 100) {
			clearInterval(interval);
			isDetecting.value = false;
		}
	}, 200);
};

const toggleCut = (cutId: string) => {
	const index = selectedCuts.value.indexOf(cutId);
	if (index > -1) {
		selectedCuts.value.splice(index, 1);
	} else {
		selectedCuts.value.push(cutId);
	}
};

const applySelectedCuts = () => {
	const cutsToApply = detectedCuts.value.filter((_, i) =>
		selectedCuts.value.includes(i.toString())
	);
	emit("applyCuts", cutsToApply);
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="scene-detection-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:content-cut" class="w-5 h-5 text-blue-500" />
				Scene Detection
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Threshold -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Detection Sensitivity</label>
				<span class="text-blue-500 text-sm font-mono">{{ threshold }}%</span>
			</div>
			<input
				v-model="threshold"
				type="range"
				min="10"
				max="90"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
			<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
				<span>Low (fewer cuts)</span>
				<span>High (more cuts)</span>
			</div>
		</div>

		<!-- Detect Button -->
		<button
			class="w-full mb-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
			:disabled="isDetecting"
			@click="startDetection"
		>
			<Icon
				:name="isDetecting ? 'mdi:loading' : 'mdi:magic-staff'"
				:class="[isDetecting ? 'animate-spin' : '', 'w-5 h-5']"
			/>
			{{ isDetecting ? "Analyzing..." : "Detect Scenes" }}
		</button>

		<!-- Progress -->
		<div v-if="isDetecting" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-700 dark:text-gray-300"
				>Analyzing video content...</span>
				<span class="text-blue-500">{{ detectionProgress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all duration-200"
					:style="{ width: `${detectionProgress}%` }"
				/>
			</div>
		</div>

		<!-- Detected Cuts -->
		<div v-if="detectedCuts.length > 0" class="flex-1 overflow-y-auto">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-700 dark:text-gray-300 text-sm font-medium"
				>Detected Scenes ({{ detectedCuts.length }})</span>
				<button
					class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
					@click="selectedCuts = detectedCuts.map((_, i) => i.toString())"
				>
					Select All
				</button>
			</div>
			<div class="space-y-1">
				<div
					v-for="(cut, index) in detectedCuts"
					:key="index"
					class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
					:class="selectedCuts.includes(index.toString())
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="toggleCut(index.toString())"
				>
					<input
						type="checkbox"
						:checked="selectedCuts.includes(index.toString())"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
					>
					<div class="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded" />
					<div class="flex-1">
						<div class="text-gray-900 dark:text-white text-sm">
							Scene {{ index + 1 }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ formatTime(cut.time) }} • Frame {{ cut.frame }}
						</div>
					</div>
					<div
						class="text-xs px-2 py-1 rounded"
						:class="cut.confidence > 80
						? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
						: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'"
					>
						{{ Math.round(cut.confidence) }}%
					</div>
				</div>
			</div>
		</div>

		<!-- Apply Button -->
		<div
			v-if="detectedCuts.length > 0"
			class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
		>
			<button
				class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="selectedCuts.length === 0"
				@click="applySelectedCuts"
			>
				<Icon name="mdi:check" class="w-4 h-4" />
				Apply {{ selectedCuts.length }} Cut{{
					selectedCuts.length !== 1 ? "s" : ""
				}}
			</button>
		</div>

		<!-- Info -->
		<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
			<div class="flex items-start gap-2">
				<Icon name="mdi:information" class="w-4 h-4 text-blue-500 mt-0.5" />
				<p class="text-blue-600 dark:text-blue-300 text-xs">
					Scene detection analyzes visual changes between frames to identify cut
					points. Higher sensitivity detects more subtle transitions.
				</p>
			</div>
		</div>
	</div>
</template>
