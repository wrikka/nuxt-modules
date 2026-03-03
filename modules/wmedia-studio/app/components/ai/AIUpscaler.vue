<script setup lang="ts">
const emit = defineEmits<
	{ close: []; upscale: [scale: number, enhance: boolean] }
>();
const scale = ref(2);
const enhanceDetails = ref(true);
const removeNoise = ref(false);
const isProcessing = ref(false);
const progress = ref(0);

const upscale = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 8;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("upscale", scale.value, enhanceDetails.value);
		}
	}, 100);
};
</script>
<template>
	<div class="ai-upscaler bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:magnify-plus" class="w-5 h-5 text-purple-500" />
				AI Upscaler
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="grid grid-cols-3 gap-2 mb-4">
			<button
				v-for="s in [2, 4, 8]"
				:key="s"
				class="p-3 rounded-lg text-center transition-all"
				:class="scale === s
				? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
				: 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'"
				@click="scale = s"
			>
				<div class="text-gray-900 dark:text-white font-bold">{{ s }}x</div>
				<div class="text-gray-500 dark:text-gray-400 text-xs">Upscale</div>
			</button>
		</div>
		<div class="space-y-2 mb-4">
			<label
				class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<input
					v-model="enhanceDetails"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Enhance Details</span>
			</label>
			<label
				class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<input
					v-model="removeNoise"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Remove Noise</span>
			</label>
		</div>
		<div v-if="isProcessing" class="mb-3">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Upscaling...</span>
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
			@click="upscale"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Upscale Image
		</button>
	</div>
</template>
