<script setup lang="ts">
const emit = defineEmits<
	{ close: []; summarize: [duration: number, highlights: boolean] }
>();
const duration = ref(60);
const highlights = ref(true);
const captions = ref(true);
const isProcessing = ref(false);
const progress = ref(0);

const summarize = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 8;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("summarize", duration.value, highlights.value);
		}
	}, 150);
};
</script>
<template>
	<div class="ai-video-summarizer bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:clipboard-list" class="w-5 h-5 text-purple-500" />
				AI Video Summarizer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
			Video Preview
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Summary Duration</span>
				<span class="text-purple-500 font-medium">{{ duration }}s</span>
			</div>
			<input
				v-model="duration"
				type="range"
				min="15"
				max="300"
				step="15"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span>15s</span><span>5min</span>
			</div>
		</div>
		<div class="space-y-2 mb-4">
			<label
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<div class="flex items-center gap-2">
					<Icon
						name="mdi:star"
						class="w-4 h-4 text-gray-500 dark:text-gray-400"
					/>
					<span class="text-gray-900 dark:text-white text-sm"
					>Auto Highlights</span>
				</div>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="highlights ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="highlights = !highlights"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="highlights ? 'left-7' : 'left-1'"
					/>
				</button>
			</label>
			<label
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<div class="flex items-center gap-2">
					<Icon
						name="mdi:subtitles"
						class="w-4 h-4 text-gray-500 dark:text-gray-400"
					/>
					<span class="text-gray-900 dark:text-white text-sm"
					>Auto Captions</span>
				</div>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="captions ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="captions = !captions"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="captions ? 'left-7' : 'left-1'"
					/>
				</button>
			</label>
		</div>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Analyzing video...</span>
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
			@click="summarize"
		>
			Generate Summary
		</button>
	</div>
</template>
