<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

const settings = reactive({
	sensitivity: 0.7,
	minSceneDuration: 1.0,
	detectFlash: true,
	detectMotion: true,
});

const isAnalyzing = ref(false);
const detectedScenes = ref([
	{ id: 1, timestamp: 0, thumbnail: "Frame 1", confidence: 95 },
	{ id: 2, timestamp: 3.5, thumbnail: "Frame 2", confidence: 88 },
	{ id: 3, timestamp: 8.2, thumbnail: "Frame 3", confidence: 92 },
	{ id: 4, timestamp: 12.1, thumbnail: "Frame 4", confidence: 85 },
]);

const onAnalyze = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
	}, 2500);
};

const splitAtScene = (timestamp: number) => {
	console.log("Split at", timestamp);
};

const splitAll = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="AI Scene Detection"
		@close="emit('close')"
	>
		<div class="space-y-6">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Automatically detect scene changes and split your video into separate
				clips.
			</p>

			<!-- Settings -->
			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Detection Sensitivity: {{ Math.round(settings.sensitivity * 100) }}%
					</label>
					<input
						v-model="settings.sensitivity"
						type="range"
						min="0.1"
						max="1"
						step="0.1"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Minimum Scene Duration: {{ settings.minSceneDuration }}s
					</label>
					<input
						v-model="settings.minSceneDuration"
						type="range"
						min="0.5"
						max="5"
						step="0.5"
						class="w-full"
					/>
				</div>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input
							v-model="settings.detectFlash"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Detect flash cuts</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							v-model="settings.detectMotion"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Detect motion changes</span>
					</label>
				</div>
			</div>

			<!-- Detected Scenes -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<h4 class="font-medium text-gray-900 dark:text-white">
						Detected Scenes ({{ detectedScenes.length }})
					</h4>
					<button
						class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
						:disabled="isAnalyzing"
						@click="onAnalyze"
					>
						<Icon
							v-if="isAnalyzing"
							name="mdi:loading"
							class="w-4 h-4 animate-spin inline mr-1"
						/>
						{{ isAnalyzing ? "Analyzing..." : "Analyze" }}
					</button>
				</div>
				<div class="grid grid-cols-4 gap-2">
					<div
						v-for="scene in detectedScenes"
						:key="scene.id"
						class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-blue-500"
						@click="splitAtScene(scene.timestamp)"
					>
						<div class="absolute inset-0 flex items-center justify-center">
							<Icon name="mdi:image" class="w-6 h-6 text-gray-400" />
						</div>
						<div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
							<p class="text-xs text-white font-medium">
								{{ scene.timestamp.toFixed(1) }}s
							</p>
							<p class="text-xs text-gray-300">{{ scene.confidence }}%</p>
						</div>
					</div>
				</div>
			</div>

			<button
				class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
				@click="splitAll"
			>
				Split at All Detected Scenes
			</button>
		</div>
	</ModalDialog>
</template>
