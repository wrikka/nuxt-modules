<script setup lang="ts">
const emit = defineEmits<
	{ close: []; correct: [temperature: number, tint: number, exposure: number] }
>();
const temperature = ref(0);
const tint = ref(0);
const exposure = ref(0);
const contrast = ref(0);
const saturation = ref(0);
const isAuto = ref(false);
const correct = () =>
	emit("correct", temperature.value, tint.value, exposure.value);
const autoCorrect = () => {
	isAuto.value = true;
	temperature.value = -5;
	tint.value = 3;
	exposure.value = 0.2;
	contrast.value = 5;
	saturation.value = 8;
	setTimeout(() => isAuto.value = false, 500);
};
</script>
<template>
	<div class="ai-color-correction bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:palette" class="w-5 h-5 text-purple-500" />
				AI Auto Color
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
			Color Preview
		</div>
		<button
			class="w-full mb-4 px-4 py-2.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
			:class="isAuto && 'animate-pulse'"
			@click="autoCorrect"
		>
			<Icon name="mdi:magic-staff" class="w-4 h-4" />Auto Correct Colors
		</button>
		<div class="space-y-3 mb-4">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Temperature</span>
					<span class="text-purple-500 font-medium">{{ temperature }}</span>
				</div>
				<input
					v-model="temperature"
					type="range"
					min="-50"
					max="50"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Tint</span>
					<span class="text-purple-500 font-medium">{{ tint }}</span>
				</div>
				<input
					v-model="tint"
					type="range"
					min="-50"
					max="50"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Exposure</span>
					<span class="text-purple-500 font-medium">{{ exposure }}</span>
				</div>
				<input
					v-model="exposure"
					type="range"
					min="-2"
					max="2"
					step="0.1"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Contrast</span>
					<span class="text-purple-500 font-medium">{{ contrast }}</span>
				</div>
				<input
					v-model="contrast"
					type="range"
					min="-50"
					max="50"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Saturation</span>
					<span class="text-purple-500 font-medium">{{ saturation }}</span>
				</div>
				<input
					v-model="saturation"
					type="range"
					min="-50"
					max="50"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="correct"
		>
			Apply Correction
		</button>
	</div>
</template>
