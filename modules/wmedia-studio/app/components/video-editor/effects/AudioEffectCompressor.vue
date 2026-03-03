<script setup lang="ts">
interface Props {
	params: {
		threshold: number;
		ratio: number;
		attack: number;
		release: number;
		makeupGain: number;
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
				min="-60"
				max="0"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Ratio</span>
				<span class="text-blue-500">1:{{ params.ratio }}</span>
			</div>
			<input
				v-model="params.ratio"
				type="range"
				min="1"
				max="20"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-600 dark:text-gray-400">Attack</span>
					<span class="text-blue-500">{{ params.attack }}ms</span>
				</div>
				<input
					v-model="params.attack"
					type="range"
					min="1"
					max="100"
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
					min="10"
					max="1000"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
				>
			</div>
		</div>
		<div>
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-600 dark:text-gray-400">Makeup Gain</span>
				<span class="text-blue-500">{{ params.makeupGain }}dB</span>
			</div>
			<input
				v-model="params.makeupGain"
				type="range"
				min="0"
				max="30"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
			>
		</div>
	</div>
</template>
