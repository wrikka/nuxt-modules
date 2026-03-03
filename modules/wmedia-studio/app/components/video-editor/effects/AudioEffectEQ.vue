<script setup lang="ts">
interface Props {
	params: {
		lowGain: number;
		midGain: number;
		midFreq: number;
		highGain: number;
	};
}

defineProps<Props>();

const formatGain = (gain: number) => `${gain > 0 ? "+" : ""}${gain}dB`;
</script>

<template>
	<div class="space-y-3">
		<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
			<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">LOW</div>
			<div class="flex gap-2">
				<input
					v-model="params.lowGain"
					type="range"
					min="-15"
					max="15"
					class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
				>
				<span class="text-xs text-blue-500 w-12 text-right">{{ formatGain(params.lowGain) }}</span>
			</div>
		</div>
		<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
			<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">MID ({{ params.midFreq }}Hz)</div>
			<div class="flex gap-2 mb-2">
				<input
					v-model="params.midGain"
					type="range"
					min="-15"
					max="15"
					class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
				>
				<span class="text-xs text-blue-500 w-12 text-right">{{ formatGain(params.midGain) }}</span>
			</div>
			<input
				v-model="params.midFreq"
				type="range"
				min="200"
				max="8000"
				class="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
			<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">HIGH</div>
			<div class="flex gap-2">
				<input
					v-model="params.highGain"
					type="range"
					min="-15"
					max="15"
					class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
				>
				<span class="text-xs text-blue-500 w-12 text-right">{{ formatGain(params.highGain) }}</span>
			</div>
		</div>
	</div>
</template>
