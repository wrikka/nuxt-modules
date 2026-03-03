<script setup lang="ts">
const emit = defineEmits<{ close: []; detect: [sensitivity: number] }>();
const sensitivity = ref(50);
const minDuration = ref(30);
const detectedChapters = ref([
	{ time: "00:00", label: "Introduction" },
	{ time: "02:30", label: "Main Topic" },
	{ time: "05:45", label: "Demonstration" },
	{ time: "08:20", label: "Conclusion" },
]);
const isDetecting = ref(false);

const detect = () => {
	isDetecting.value = true;
	setTimeout(() => {
		isDetecting.value = false;
		emit("detect", sensitivity.value);
	}, 2000);
};
</script>
<template>
	<div class="ai-chapter-detection bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:bookmark" class="w-5 h-5 text-purple-500" />
				AI Chapter Detection
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Detection Sensitivity</span>
				<span class="text-purple-500 font-medium">{{ sensitivity }}%</span>
			</div>
			<input
				v-model="sensitivity"
				type="range"
				min="10"
				max="90"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Minimum Chapter Duration</span>
				<span class="text-purple-500 font-medium">{{ minDuration }}s</span>
			</div>
			<input
				v-model="minDuration"
				type="range"
				min="10"
				max="120"
				step="5"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>
		<button
			class="w-full mb-4 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isDetecting"
			@click="detect"
		>
			<Icon
				v-if="isDetecting"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>Detect Chapters
		</button>
		<div class="flex-1 overflow-y-auto">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Detected Chapters ({{ detectedChapters.length }})
			</div>
			<div class="space-y-2">
				<div
					v-for="(chapter, i) in detectedChapters"
					:key="i"
					class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<div class="text-purple-500 text-sm font-mono">
						{{ chapter.time }}
					</div>
					<input
						v-model="chapter.label"
						type="text"
						class="flex-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
					/>
					<button
						class="text-gray-400 hover:text-red-500"
						@click="detectedChapters.splice(i, 1)"
					>
						<Icon name="mdi:close" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
		<button class="mt-4 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
			Apply Chapters
		</button>
	</div>
</template>
