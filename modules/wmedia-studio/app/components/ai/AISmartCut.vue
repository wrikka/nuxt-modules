<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

const settings = reactive({
	silenceThreshold: -40,
	minDuration: 0.5,
	paddingFrames: 5,
	removeGaps: true,
	preserveTransitions: true,
});

const isProcessing = ref(false);
const detectedSegments = ref([
	{ id: 1, start: 0, end: 2.5, type: "content", confidence: 95 },
	{ id: 2, start: 2.5, end: 4.0, type: "silence", confidence: 98 },
	{ id: 3, start: 4.0, end: 8.5, type: "content", confidence: 92 },
]);

const totalDuration = 10;
const silenceDuration = computed(() => {
	return detectedSegments.value
		.filter(s => s.type === "silence")
		.reduce((acc, s) => acc + (s.end - s.start), 0);
});

const onProcess = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
	}, 2000);
};

const onApply = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="AI Smart Cut"
		@close="emit('close')"
	>
		<div class="space-y-6">
			<!-- Description -->
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Automatically detect and remove silent/unnecessary segments from your
				video.
			</p>

			<!-- Settings -->
			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Silence Threshold (dB): {{ settings.silenceThreshold }}
					</label>
					<input
						v-model="settings.silenceThreshold"
						type="range"
						min="-60"
						max="-20"
						class="w-full"
					/>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Minimum Silence Duration (s): {{ settings.minDuration }}
					</label>
					<input
						v-model="settings.minDuration"
						type="range"
						min="0.1"
						max="2"
						step="0.1"
						class="w-full"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<label class="flex items-center gap-3">
						<input
							v-model="settings.removeGaps"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Remove gaps</span>
					</label>
					<label class="flex items-center gap-3">
						<input
							v-model="settings.preserveTransitions"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Preserve transitions</span>
					</label>
				</div>
			</div>

			<!-- Preview -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
					Detected Segments
				</h4>
				<div class="space-y-2">
					<div
						v-for="segment in detectedSegments"
						:key="segment.id"
						class="flex items-center gap-3 p-2 rounded"
						:class="segment.type === 'silence'
						? 'bg-red-100 dark:bg-red-900/30'
						: 'bg-green-100 dark:bg-green-900/30'"
					>
						<Icon
							:name="segment.type === 'silence'
							? 'mdi:volume-off'
							: 'mdi:volume-high'"
							class="w-4 h-4"
							:class="segment.type === 'silence' ? 'text-red-600' : 'text-green-600'"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300 flex-1">
							{{ segment.start.toFixed(1) }}s - {{ segment.end.toFixed(1) }}s
						</span>
						<span
							class="text-xs px-2 py-1 rounded-full"
							:class="segment.type === 'silence'
							? 'bg-red-200 text-red-800'
							: 'bg-green-200 text-green-800'"
						>
							{{ segment.confidence }}% confidence
						</span>
					</div>
				</div>
				<div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
					Total: {{ totalDuration }}s | Silence detected: {{
						silenceDuration.toFixed(1)
					}}s | Will save: {{
						((silenceDuration / totalDuration) * 100).toFixed(0)
					}}%
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
					:disabled="isProcessing"
					@click="onProcess"
				>
					<Icon
						v-if="isProcessing"
						name="mdi:loading"
						class="w-4 h-4 animate-spin inline mr-2"
					/>
					{{ isProcessing ? "Analyzing..." : "Analyze Video" }}
				</button>
				<button
					class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
					@click="onApply"
				>
					Apply Cuts
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
