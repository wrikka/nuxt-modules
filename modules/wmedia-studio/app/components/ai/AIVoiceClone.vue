<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const step = ref<"record" | "train" | "synthesize">("record");
const isRecording = ref(false);
const trainingProgress = ref(0);
const textToSynthesize = ref("Hello, this is my AI cloned voice speaking.");

const startRecording = () => {
	isRecording.value = true;
	setTimeout(() => {
		isRecording.value = false;
		step.value = "train";
	}, 3000);
};

const startTraining = () => {
	const interval = setInterval(() => {
		trainingProgress.value += 5;
		if (trainingProgress.value >= 100) {
			clearInterval(interval);
			step.value = "synthesize";
		}
	}, 200);
};

const synthesize = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="AI Voice Clone"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<!-- Step 1: Record -->
			<div v-if="step === 'record'" class="space-y-4">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Record at least 30 seconds of clear speech to train your voice model.
				</p>
				<div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center gap-4">
					<div
						class="w-20 h-20 rounded-full flex items-center justify-center transition-all"
						:class="isRecording
						? 'bg-red-500 animate-pulse'
						: 'bg-blue-500 hover:bg-blue-600'"
					>
						<Icon
							:name="isRecording ? 'mdi:stop' : 'mdi:microphone'"
							class="w-8 h-8 text-white"
						/>
					</div>
					<p
						class="text-lg font-medium"
						:class="isRecording ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'"
					>
						{{ isRecording ? "Recording..." : "Click to Record" }}
					</p>
					<div v-if="isRecording" class="flex gap-1 h-8 items-end">
						<div
							v-for="i in 8"
							:key="i"
							class="w-2 bg-red-400 rounded-full animate-pulse"
							:style="{
								height: `${Math.random() * 100}%`,
								animationDelay: `${i * 0.1}s`,
							}"
						/>
					</div>
				</div>
				<button
					class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					:disabled="isRecording"
					@click="startRecording"
				>
					{{ isRecording ? "Recording in progress..." : "Start Recording" }}
				</button>
			</div>

			<!-- Step 2: Train -->
			<div v-else-if="step === 'train'" class="space-y-4">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Training your voice model. This may take a few minutes.
				</p>
				<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
					<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
						<Icon name="mdi:brain" class="w-8 h-8 text-purple-500" />
					</div>
					<h4 class="font-medium text-gray-900 dark:text-white mb-2">
						Training Voice Model
					</h4>
					<div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
						<div
							class="h-full bg-purple-500 rounded-full transition-all"
							:style="{ width: `${trainingProgress}%` }"
						/>
					</div>
					<p class="text-sm text-gray-500">{{ trainingProgress }}% complete</p>
				</div>
				<button
					class="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
					:disabled="trainingProgress > 0"
					@click="startTraining"
				>
					Start Training
				</button>
			</div>

			<!-- Step 3: Synthesize -->
			<div v-else class="space-y-4">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Your voice model is ready! Enter text to synthesize.
				</p>
				<div class="space-y-3">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Text to Speak</label>
					<textarea
						v-model="textToSynthesize"
						rows="3"
						class="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
					/>
				</div>
				<div class="flex gap-3">
					<button class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
						<Icon name="mdi:play" class="w-4 h-4 inline mr-2" />
						Preview
					</button>
					<button
						class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
						@click="synthesize"
					>
						<Icon name="mdi:content-save" class="w-4 h-4 inline mr-2" />
						Save Audio
					</button>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
