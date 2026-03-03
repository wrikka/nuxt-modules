<script setup lang="ts">
interface Props {
	lastUpdate: Date;
	isLive: boolean;
}

const props = defineProps({
	lastUpdate: {
		type: Date,
		required: true,
	},
	isLive: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits<{
	(e: "toggle"): void;
}>();

const timeSinceUpdate = computed(() => {
	const diff = Date.now() - props.lastUpdate.getTime();
	const seconds = Math.floor(diff / 1000);
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	return `${hours}h ago`;
});
</script>

<template>
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
			<span
				class="w-2 h-2 rounded-full"
				:class="isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
			/>
			<span>{{ isLive ? "Live" : "Paused" }}</span>
			<span class="text-gray-400">|</span>
			<span>Updated {{ timeSinceUpdate }}</span>
		</div>
		<button
			class="p-1.5 rounded-md transition-colors"
			:class="isLive
			? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
			: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'"
			@click="emit('toggle')"
		>
			<i :class="isLive ? 'i-mdi-pause' : 'i-mdi-play'" />
		</button>
	</div>
</template>
