<script setup lang="ts">
const emit = defineEmits<
	{ close: []; stabilize: [strength: number, crop: boolean] }
>();
const strength = ref(70);
const cropEdges = ref(true);
const rollingShutter = ref(false);
const isProcessing = ref(false);
const progress = ref(0);

const stabilize = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("stabilize", strength.value, cropEdges.value);
		}
	}, 100);
};
</script>
<template>
	<div class="video-stabilizer bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:video" class="w-5 h-5 text-blue-500" />
				Video Stabilizer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm relative overflow-hidden">
			<span>Stabilization Preview</span>
			<div
				v-if="isProcessing"
				class="absolute inset-0 bg-black/50 flex items-center justify-center"
			>
				<div class="text-white text-sm font-medium">{{ progress }}%</div>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400"
				>Stabilization Strength</span>
				<span class="text-blue-500 font-medium">{{ strength }}%</span>
			</div>
			<input
				v-model="strength"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			/>
		</div>
		<div class="space-y-2 mb-4">
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-900 dark:text-white text-sm">Crop Edges</span>
				<input
					v-model="cropEdges"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
			</label>
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-900 dark:text-white text-sm"
				>Rolling Shutter Fix</span>
				<input
					v-model="rollingShutter"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
			</label>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing"
			@click="stabilize"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline-block mr-2"
			/>Apply Stabilization
		</button>
	</div>
</template>
