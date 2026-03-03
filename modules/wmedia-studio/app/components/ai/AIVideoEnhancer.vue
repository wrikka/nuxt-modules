<script setup lang="ts">
const emit = defineEmits<{ close: []; enhance: [settings: any] }>();
const settings = ref({
	sharpen: 30,
	denoise: 40,
	deblur: 20,
	colorBoost: 25,
	superRes: true,
});
const isProcessing = ref(false);
const progress = ref(0);

const enhance = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("enhance", settings.value);
		}
	}, 100);
};
</script>
<template>
	<div class="ai-video-enhancer bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:magic-staff" class="w-5 h-5 text-purple-500" />
				AI Video Enhancer
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
				Enhancement Preview
			</div>
			<div class="absolute bottom-2 left-2 px-2 py-1 bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300 text-xs rounded font-medium">
				AI Enhanced
			</div>
		</div>
		<div class="space-y-3 mb-4">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Sharpening</span>
					<span class="text-purple-500 font-medium">{{
							settings.sharpen
						}}%</span>
				</div>
				<input
					v-model="settings.sharpen"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Noise Reduction</span>
					<span class="text-purple-500 font-medium">{{
							settings.denoise
						}}%</span>
				</div>
				<input
					v-model="settings.denoise"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Deblur</span>
					<span class="text-purple-500 font-medium">{{
							settings.deblur
						}}%</span>
				</div>
				<input
					v-model="settings.deblur"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Color Boost</span>
					<span class="text-purple-500 font-medium">{{
							settings.colorBoost
						}}%</span>
				</div>
				<input
					v-model="settings.colorBoost"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
		</div>
		<label
			class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer mb-4"
		>
			<span class="text-gray-900 dark:text-white text-sm"
			>Super Resolution (4K)</span>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="settings.superRes ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="settings.superRes = !settings.superRes"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="settings.superRes ? 'left-7' : 'left-1'"
				/>
			</button>
		</label>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Enhancing...</span>
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
			@click="enhance"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Enhance Video
		</button>
	</div>
</template>
