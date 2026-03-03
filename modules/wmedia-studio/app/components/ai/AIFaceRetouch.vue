<script setup lang="ts">
const emit = defineEmits<
	{ close: []; retouch: [smoothness: number, whitening: number] }
>();
const smoothness = ref(50);
const whitening = ref(30);
const eyeEnhance = ref(40);
const removeBlemishes = ref(true);
const retouch = () => emit("retouch", smoothness.value, whitening.value);
</script>
<template>
	<div class="ai-face-retouch bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:smile" class="w-5 h-5 text-purple-500" />
				AI Face Retouch
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
			Face Preview
		</div>
		<div class="space-y-3 mb-4">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Skin Smoothness</span>
					<span class="text-purple-500 font-medium">{{ smoothness }}%</span>
				</div>
				<input
					v-model="smoothness"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Teeth Whitening</span>
					<span class="text-purple-500 font-medium">{{ whitening }}%</span>
				</div>
				<input
					v-model="whitening"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Eye Enhancement</span>
					<span class="text-purple-500 font-medium">{{ eyeEnhance }}%</span>
				</div>
				<input
					v-model="eyeEnhance"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
				/>
			</div>
			<label
				class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<input
					v-model="removeBlemishes"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Remove Blemishes</span>
			</label>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="retouch"
		>
			Apply Retouch
		</button>
	</div>
</template>
