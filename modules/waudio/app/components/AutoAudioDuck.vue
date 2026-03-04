<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const settings = reactive({
	threshold: -20,
	reduction: 12,
	attack: 10,
	release: 100,
	sidechain: "voice",
	autoDetect: true,
});

const sidechainOptions = [
	{ id: "voice", name: "Voice Track" },
	{ id: "dialogue", name: "Dialogue Track" },
	{ id: "manual", name: "Manual Trigger" },
];

const isAnalyzing = ref(false);

const onAutoDetect = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
	}, 1500);
};

const onApply = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Auto Audio Ducking"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Automatically lower music volume when voice/dialogue is detected.
			</p>

			<!-- Sidechain Source -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>Sidechain Source</label>
				<div class="space-y-2">
					<label
						v-for="option in sidechainOptions"
						:key="option.id"
						class="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
					>
						<input
							v-model="settings.sidechain"
							type="radio"
							:value="option.id"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300">{{
							option.name
						}}</span>
					</label>
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Voice Threshold: {{ settings.threshold }}dB
					</label>
					<input
						v-model="settings.threshold"
						type="range"
						min="-40"
						max="-10"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Music Reduction: {{ settings.reduction }}dB
					</label>
					<input
						v-model="settings.reduction"
						type="range"
						min="0"
						max="24"
						class="w-full"
					/>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Attack: {{ settings.attack }}ms
						</label>
						<input
							v-model="settings.attack"
							type="range"
							min="1"
							max="100"
							class="w-full"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Release: {{ settings.release }}ms
						</label>
						<input
							v-model="settings.release"
							type="range"
							min="10"
							max="500"
							class="w-full"
						/>
					</div>
				</div>
			</div>

			<!-- Visualizer -->
			<div class="bg-gray-900 rounded-lg p-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-gray-400">Music Track</span>
					<div class="flex gap-1 h-8 items-end">
						<div
							v-for="i in 12"
							:key="i"
							class="w-1 bg-blue-500 rounded-full"
							:style="{ height: `${20 + Math.random() * 60}%` }"
						/>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-xs text-gray-400">Voice Track</span>
					<div class="flex gap-1 h-4 items-end">
						<div
							v-for="i in 12"
							:key="i"
							class="w-1 bg-green-500 rounded-full"
							:style="{ height: `${Math.random() * 100}%` }"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
					:disabled="isAnalyzing"
					@click="onAutoDetect"
				>
					<Icon
						v-if="isAnalyzing"
						name="mdi:loading"
						class="w-4 h-4 animate-spin inline mr-2"
					/>
					{{ isAnalyzing ? "Analyzing..." : "Auto-Detect Settings" }}
				</button>
				<button
					class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
					@click="onApply"
				>
					Apply Ducking
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
