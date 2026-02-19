<script setup lang="ts">
import type { Slide } from "../types";

const props = defineProps<{
	slides: Slide[];
	currentIndex: number;
	isOpen: boolean;
}>();

const emit = defineEmits<{
	select: [index: number];
	close: [];
}>();

function selectSlide(index: number) {
	emit("select", index);
	emit("close");
}

function getSlideThumbnail(slide: Slide) {
	// Extract first heading or first 50 chars as thumbnail text
	const text = slide.content.replace(/[#*`]/g, "").slice(0, 50);
	return text || "Slide";
}
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-300"
			leave-active-class="transition-opacity duration-300"
			enter-from-class="opacity-0"
			leave-to-class="opacity-0"
		>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-auto"
				@click.self="emit('close')"
			>
				<div class="p-8">
					<div class="max-w-7xl mx-auto">
						<h2 class="text-2xl font-bold text-white mb-6">Slide Overview</h2>
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							<button
								v-for="(slide, index) in slides"
								:key="slide.id"
								class="relative aspect-video bg-gray-800 rounded-lg p-4 text-left transition-all hover:bg-gray-700 hover:scale-105 border-2"
								:class="index === currentIndex ? 'border-blue-500' : 'border-transparent'"
								@click="selectSlide(index)"
							>
								<div class="text-xs text-gray-400 mb-1">{{ index + 1 }}</div>
								<div class="text-sm text-white line-clamp-3">{{ getSlideThumbnail(slide) }}</div>
								<div
									v-if="index === currentIndex"
									class="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
