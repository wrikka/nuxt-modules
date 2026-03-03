<script setup lang="ts">
const emit = defineEmits<{ close: []; removeBackground: [file: string] }>();
const isProcessing = ref(false);
const progress = ref(0);
const selectedFile = ref("image.jpg");
const previewMode = ref("original");

const removeBackground = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("removeBackground", selectedFile.value);
		}
	}, 150);
};
</script>
<template>
	<div class="ai-bg-remover bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:account" class="w-5 h-5 text-purple-500" />
				AI Background Remover
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				{{
					previewMode === "original" ? "Original Image" : "Background Removed"
				}}
			</div>
			<div
				v-if="previewMode === 'removed'"
				class="absolute inset-0 bg-[url('/checkerboard.png')]"
			/>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				class="flex-1 px-3 py-2 rounded-lg text-sm transition-all"
				:class="previewMode === 'original'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="previewMode = 'original'"
			>
				Original
			</button>
			<button
				class="flex-1 px-3 py-2 rounded-lg text-sm transition-all"
				:class="previewMode === 'removed'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="previewMode = 'removed'"
			>
				No Background
			</button>
		</div>
		<div v-if="isProcessing" class="mb-3">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Removing background...</span>
				<span class="text-purple-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
				<div
					class="h-full bg-purple-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="removeBackground"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Remove Background
		</button>
	</div>
</template>
