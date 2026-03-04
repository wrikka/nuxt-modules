<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: SmartReframeSettings];
}>();

interface SmartReframeSettings {
	targetRatio: "1:1" | "9:16" | "16:9" | "4:5";
	focalPoint: "auto" | "center" | "face" | "object";
	smoothMotion: boolean;
	padding: number;
}

const settings = ref<SmartReframeSettings>({
	targetRatio: "9:16",
	focalPoint: "auto",
	smoothMotion: true,
	padding: 10,
});

const ratios = [
	{
		id: "1:1",
		label: "Square",
		icon: "i-ph-square",
		width: 1080,
		height: 1080,
	},
	{
		id: "9:16",
		label: "Vertical",
		icon: "i-ph-device-mobile",
		width: 1080,
		height: 1920,
	},
	{
		id: "16:9",
		label: "Landscape",
		icon: "i-ph-monitor",
		width: 1920,
		height: 1080,
	},
	{
		id: "4:5",
		label: "Portrait",
		icon: "i-ph-device-mobile-camera",
		width: 1080,
		height: 1350,
	},
];

const focalOptions = [
	{ id: "auto", label: "Auto Detect", icon: "i-ph-magic-wand" },
	{ id: "center", label: "Center", icon: "i-ph-crosshair" },
	{ id: "face", label: "Face Tracking", icon: "i-ph-user" },
	{ id: "object", label: "Object", icon: "i-ph-bounding-box" },
];

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
</script>

<template>
	<div class="smart-reframe-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:crop" class="w-5 h-5 text-blue-500" />
				Smart Reframe
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Target Aspect Ratio -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Target Aspect Ratio</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="ratio in ratios"
					:key="ratio.id"
					class="flex items-center gap-2 p-3 rounded-lg transition-colors"
					:class="settings.targetRatio === ratio.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="settings.targetRatio = ratio.id as any"
				>
					<span
						:class="[ratio.icon, 'w-5 h-5 text-gray-500 dark:text-gray-400']"
					/>
					<div class="text-left">
						<div class="text-gray-900 dark:text-white text-sm">
							{{ ratio.label }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ ratio.width }}x{{ ratio.height }}
						</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Focal Point -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Focal Point</label>
			<div class="space-y-1">
				<button
					v-for="option in focalOptions"
					:key="option.id"
					class="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
					:class="settings.focalPoint === option.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="settings.focalPoint = option.id as any"
				>
					<span
						:class="[option.icon, 'w-4 h-4 text-gray-500 dark:text-gray-400']"
					/>
					<span class="text-gray-900 dark:text-white text-sm">{{
						option.label
					}}</span>
				</button>
			</div>
		</div>

		<!-- Smooth Motion -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<div>
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Smooth Camera Motion</span>
				<p class="text-gray-500 dark:text-gray-400 text-xs">
					Reduce jitter in reframed video
				</p>
			</div>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="settings.smoothMotion ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="settings.smoothMotion = !settings.smoothMotion"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="settings.smoothMotion ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<!-- Padding -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Subject Padding</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.padding
					}}%</span>
			</div>
			<input
				v-model="settings.padding"
				type="range"
				min="0"
				max="30"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Preview -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Preview</label>
			<div class="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
				<!-- Original frame -->
				<div class="absolute inset-0 bg-gray-200 dark:bg-gray-700">
					<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
						Original 16:9
					</div>
					<!-- Target frame overlay -->
					<div
						class="absolute border-2 border-blue-500 bg-blue-500/10 transition-all"
						:class="previewActive ? 'animate-pulse' : ''"
						:style="{
							width: settings.targetRatio === '9:16'
								? '33%'
								: settings.targetRatio === '1:1'
								? '56%'
								: settings.targetRatio === '4:5'
								? '45%'
								: '100%',
							height: settings.targetRatio === '16:9'
								? '100%'
								: settings.targetRatio === '1:1'
								? '56%'
								: settings.targetRatio === '4:5'
								? '80%'
								: '100%',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}"
					>
						<div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-500 whitespace-nowrap">
							Target {{ settings.targetRatio }}
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-center mt-2">
				<button
					class="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
					@click="togglePreview"
				>
					{{ previewActive ? "Stop" : "Play" }} Preview
				</button>
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
				:disabled="isProcessing"
				@click="handleApply"
			>
				<Icon
					v-if="isProcessing"
					name="mdi:loading"
					class="w-4 h-4 animate-spin"
				/>
				Apply Reframe
			</button>
		</div>
	</div>
</template>
