<script setup lang="ts">
import type { AudioCursorPosition } from "#shared/types/audio";

const props = defineProps<{
	cursors: AudioCursorPosition[];
	currentUserId: string;
}>();

const emit = defineEmits<{
	updatePosition: [x: number, y: number];
}>();

const containerRef = ref<HTMLElement | null>(null);

const otherCursors = computed(() => {
	return props.cursors.filter(c => c.userId !== props.currentUserId);
});

const handleMouseMove = (event: MouseEvent) => {
	if (!containerRef.value) return;

	const rect = containerRef.value.getBoundingClientRect();
	const x = ((event.clientX - rect.left) / rect.width) * 100;
	const y = ((event.clientY - rect.top) / rect.height) * 100;

	emit(
		"updatePosition",
		Math.max(0, Math.min(100, x)),
		Math.max(0, Math.min(100, y)),
	);
};

const formatTime = (timestamp: number): string => {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	if (seconds < 5) return "now";
	if (seconds < 60) return `${seconds}s ago`;
	return `${Math.floor(seconds / 60)}m ago`;
};
</script>

<template>
	<div
		ref="containerRef"
		class="relative w-full h-full"
		@mousemove="handleMouseMove"
	>
		<!-- Other users' cursors -->
		<div
			v-for="cursor in otherCursors"
			:key="cursor.userId"
			class="absolute pointer-events-none transition-all duration-150 ease-out z-50"
			:style="{
				left: `${cursor.x}%`,
				top: `${cursor.y}%`,
				transform: 'translate(-50%, -50%)',
			}"
		>
			<!-- Cursor icon -->
			<svg
				class="w-5 h-5 drop-shadow-lg"
				:style="{ color: cursor.color }"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.45.45 0 00.32-.77L6.18 2.87a.45.45 0 00-.68.34z" />
			</svg>

			<!-- User label -->
			<div
				class="absolute left-4 top-4 px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
				:style="{ backgroundColor: cursor.color, color: '#fff' }"
			>
				{{ cursor.userName }}
				<span class="opacity-75 ml-1">{{ formatTime(cursor.timestamp) }}</span>
			</div>
		</div>

		<!-- User count badge -->
		<div
			v-if="otherCursors.length > 0"
			class="absolute top-2 right-2 bg-gray-800/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 z-50"
		>
			<div class="flex -space-x-1">
				<div
					v-for="cursor in otherCursors.slice(0, 3)"
					:key="cursor.userId"
					class="w-5 h-5 rounded-full border-2 border-gray-800"
					:style="{ backgroundColor: cursor.color }"
				/>
			</div>
			<span class="text-xs text-gray-300">
				{{ otherCursors.length }} user{{ otherCursors.length !== 1 ? "s" : "" }}
				online
			</span>
		</div>
	</div>
</template>
