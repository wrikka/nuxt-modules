<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";
import { onMounted, onUnmounted, ref } from "vue";

defineProps<{
	media: MediaItem;
}>();

const emit = defineEmits<{
	close: [];
}>();

const zoom = ref(1);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const translateX = ref(0);
const translateY = ref(0);

const handleZoomIn = () => {
	zoom.value = Math.min(zoom.value + 0.25, 5);
};

const handleZoomOut = () => {
	zoom.value = Math.max(zoom.value - 0.25, 0.5);
};

const handleResetZoom = () => {
	zoom.value = 1;
	translateX.value = 0;
	translateY.value = 0;
};

const handleWheel = (e: WheelEvent) => {
	e.preventDefault();
	if (e.deltaY < 0) {
		handleZoomIn();
	} else {
		handleZoomOut();
	}
};

const handleMouseDown = (e: MouseEvent) => {
	if (zoom.value > 1) {
		isDragging.value = true;
		startX.value = e.clientX - translateX.value;
		startY.value = e.clientY - translateY.value;
	}
};

const handleMouseMove = (e: MouseEvent) => {
	if (isDragging.value) {
		translateX.value = e.clientX - startX.value;
		translateY.value = e.clientY - startY.value;
	}
};

const handleMouseUp = () => {
	isDragging.value = false;
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === "Escape") {
		emit("close");
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
		@click.self="$emit('close')"
	>
		<div class="relative h-full w-full max-w-7xl p-4" @wheel="handleWheel">
			<button
				@click="$emit('close')"
				class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 backdrop-blur-sm"
			>
				<i class="i-mdi-close text-2xl" />
			</button>

			<div class="flex h-full items-center justify-center">
				<div
					v-if="media.type === 'image'"
					class="relative cursor-grab active:cursor-grabbing"
					@mousedown="handleMouseDown"
					@mousemove="handleMouseMove"
					@mouseup="handleMouseUp"
					@mouseleave="handleMouseUp"
				>
					<img
						:src="media.url"
						:alt="media.name"
						class="max-h-[80vh] max-w-full object-contain transition-transform"
						:style="{
							transform:
								`scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
						}"
					/>
				</div>

				<video
					v-else-if="media.type === 'video'"
					:src="media.url"
					controls
					autoplay
					class="max-h-[80vh] max-w-full"
				/>

				<audio
					v-else-if="media.type === 'audio'"
					:src="media.url"
					controls
					autoplay
					class="w-full max-w-2xl"
				/>

				<div
					v-else
					class="flex flex-col items-center justify-center text-white"
				>
					<i class="i-mdi-file text-6xl" />
					<p class="mt-4 text-lg">{{ media.name }}</p>
					<p class="text-sm text-gray-400">{{ media.mimeType }}</p>
				</div>
			</div>

			<div
				v-if="media.type === 'image'"
				class="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-black/50 p-2 backdrop-blur-sm"
			>
				<button
					@click="handleZoomOut"
					class="rounded bg-white/10 p-2 text-white hover:bg-white/20"
					title="Zoom Out"
				>
					<i class="i-mdi-minus" />
				</button>
				<span class="min-w-[3rem] text-center text-sm text-white">{{
						Math.round(zoom * 100)
					}}%</span>
				<button
					@click="handleZoomIn"
					class="rounded bg-white/10 p-2 text-white hover:bg-white/20"
					title="Zoom In"
				>
					<i class="i-mdi-plus" />
				</button>
				<button
					@click="handleResetZoom"
					class="rounded bg-white/10 p-2 text-white hover:bg-white/20"
					title="Reset Zoom"
				>
					<i class="i-mdi-refresh" />
				</button>
			</div>

			<div class="absolute bottom-4 right-4 rounded-lg bg-black/50 p-3 backdrop-blur-sm">
				<p class="text-sm text-white font-medium">{{ media.name }}</p>
				<p class="text-xs text-gray-400">{{ media.mimeType }}</p>
			</div>
		</div>
	</div>
</template>
