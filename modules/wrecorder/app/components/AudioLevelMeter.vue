<script setup lang="ts">
import { useAudioLevel } from "~/composables/useAudioLevel";

const props = defineProps<{
	stream: MediaStream | null;
}>();

const { audioLevel, startMonitoring, stopMonitoring } = useAudioLevel();

watch(
	() => props.stream,
	(newStream) => {
		if (newStream) {
			startMonitoring(newStream);
		} else {
			stopMonitoring();
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	stopMonitoring();
});
</script>

<template>
	<div class="flex items-center space-x-2">
		<Icon
			name="mdi:microphone"
			class="w-4 h-4 text-gray-600 dark:text-gray-400"
		/>
		<div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
			<div
				class="h-full transition-all duration-100 ease-out"
				:class="[
					'rounded-full',
					audioLevel > 80
						? 'bg-red-500'
						: audioLevel > 50
						? 'bg-yellow-500'
						: 'bg-green-500',
				]"
				:style="{ width: `${audioLevel}%` }"
			/>
		</div>
		<span class="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
			{{ Math.round(audioLevel) }}%
		</span>
	</div>
</template>
