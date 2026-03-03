<script setup lang="ts">
interface Props {
	params: {
		threshold: number;
		release: number;
		lookahead: number;
	};
}

defineProps<Props>();
</script>

<template>
	<div class="space-y-3">
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Threshold</span>
				<span class="text-blue-500">{{ params.threshold }}dB</span>
			</div>
			<input
				v-model="params.threshold"
				type="range"
				min="-20"
				max="0"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Release</span>
				<span class="text-blue-500">{{ params.release }}ms</span>
			</div>
			<input
				v-model="params.release"
				type="range"
				min="1"
				max="500"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Lookahead</span>
				<span class="text-blue-500">{{ params.lookahead }}ms</span>
			</div>
			<input
				v-model="params.lookahead"
				type="range"
				min="0"
				max="20"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
	</div>
</template>
