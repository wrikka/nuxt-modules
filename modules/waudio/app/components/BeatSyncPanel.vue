<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const settings = reactive({
	sensitivity: 75,
	beatSnap: true,
	autoTransition: false,
	transitionDuration: 0.5,
});

const detectedBeats = ref([
	{ time: 0.5, strength: 90 },
	{ time: 1.2, strength: 85 },
	{ time: 2.0, strength: 95 },
	{ time: 2.8, strength: 80 },
	{ time: 3.5, strength: 92 },
	{ time: 4.2, strength: 88 },
]);

const isAnalyzing = ref(false);
const audioDuration = 5;

const onAnalyze = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
	}, 2000);
};

const applyBeatSync = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Audio Beat Detection"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Auto-sync cuts and transitions to detected music beats for rhythmic
				editing.
			</p>

			<!-- Settings -->
			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Detection Sensitivity: {{ settings.sensitivity }}%
					</label>
					<input
						v-model="settings.sensitivity"
						type="range"
						min="0"
						max="100"
						class="w-full"
					/>
				</div>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input
							v-model="settings.beatSnap"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Snap to beats</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							v-model="settings.autoTransition"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Auto-transitions</span>
					</label>
				</div>
				<div v-if="settings.autoTransition">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Transition Duration: {{ settings.transitionDuration }}s
					</label>
					<input
						v-model="settings.transitionDuration"
						type="range"
						min="0.1"
						max="2"
						step="0.1"
						class="w-full"
					/>
				</div>
			</div>

			<!-- Beat Visualization -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<h4 class="font-medium text-gray-900 dark:text-white">
						Detected Beats
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
						{{ isAnalyzing ? "Analyzing..." : "Analyze Audio" }}
					</button>
				</div>
				<div class="relative h-16 bg-gray-900 rounded overflow-hidden">
					<!-- Waveform mock -->
					<div class="absolute inset-0 flex items-center justify-center opacity-30">
						<svg
							class="w-full h-8"
							viewBox="0 0 100 20"
							preserveAspectRatio="none"
						>
							<path
								d="M0,10 Q10,5 20,10 T40,10 T60,10 T80,10 T100,10"
								fill="none"
								stroke="currentColor"
								stroke-width="0.5"
								class="text-green-500"
							/>
						</svg>
					</div>
					<!-- Beat markers -->
					<div
						v-for="beat in detectedBeats"
						:key="beat.time"
						class="absolute top-0 bottom-0 w-0.5 bg-green-500"
						:style="{
							left: `${(beat.time / audioDuration) * 100}%`,
							opacity: beat.strength / 100,
						}"
					>
						<div class="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
					</div>
				</div>
				<div class="mt-2 text-xs text-gray-500 text-center">
					{{ detectedBeats.length }} beats detected • {{ audioDuration }}s
					duration
				</div>
			</div>

			<button
				class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
				@click="applyBeatSync"
			>
				Apply Beat Sync
			</button>
		</div>
	</ModalDialog>
</template>
