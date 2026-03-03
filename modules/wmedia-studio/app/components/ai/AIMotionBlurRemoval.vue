<script setup lang="ts">
const emit = defineEmits<{ close: []; remove: [strength: number] }>();
const strength = ref(75);
const preserveDetails = ref(true);
const isProcessing = ref(false);
const progress = ref(0);

const remove = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 8;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("remove", strength.value);
		}
	}, 150);
};
</script>

<template>
	<div class="ai-motion-blur-removal bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:aperture" class="w-5 h-5 text-purple-500" />
				AI Motion Blur Removal
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Blur Removal Preview
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Removal Strength</span>
				<span class="text-purple-500 font-medium">{{ strength }}%</span>
			</div>
			<input
				v-model="strength"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-900 dark:text-white text-sm"
			>Preserve Fine Details</span>
			<input
				v-model="preserveDetails"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
			>
		</label>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Processing...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="remove"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Remove Motion Blur
		</button>
	</div>
</template>
