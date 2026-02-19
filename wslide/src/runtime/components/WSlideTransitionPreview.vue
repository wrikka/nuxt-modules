<script setup lang="ts">
import type { Slide } from "../types";

const props = defineProps<{
	slides: Slide[];
	currentTransition?: string;
}>();

const emit = defineEmits<{
	preview: [transition: string];
}>();

const isOpen = ref(false);
const selectedTransition = ref(props.currentTransition || "slide");

const transitions = [
	{ name: "slide", label: "Slide", description: "Classic slide transition" },
	{ name: "fade", label: "Fade", description: "Smooth fade in/out" },
	{ name: "zoom", label: "Zoom", description: "Zoom in effect" },
	{ name: "flip", label: "Flip", description: "3D flip animation" },
	{ name: "cube", label: "Cube", description: "Cube rotation" },
	{ name: "parallax", label: "Parallax", description: "Parallax slide" },
	{ name: "dissolve", label: "Dissolve", description: "Dissolve effect" },
	{ name: "wipe", label: "Wipe", description: "Wipe transition" },
];

const currentSlideIndex = ref(0);
const isAnimating = ref(false);

function previewTransition(transition: string) {
	selectedTransition.value = transition;
	isAnimating.value = true;
	currentSlideIndex.value = (currentSlideIndex.value + 1) % (props.slides.length || 2);
	emit("preview", transition);
	setTimeout(() => {
		isAnimating.value = false;
	}, 500);
}
</script>

<template>
	<div class="relative">
		<button
			class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
			@click="isOpen = !isOpen"
			title="Preview Transitions"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polygon points="5 3 19 12 5 21 5 3" />
			</svg>
			<span class="text-sm">Preview</span>
		</button>

		<div
			v-if="isOpen"
			class="absolute bottom-full mb-2 right-0 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-4 min-w-[300px] z-50"
		>
			<div class="text-xs text-gray-400 uppercase tracking-wider mb-3">Transition Preview</div>

			<!-- Preview area -->
			<div class="relative h-32 bg-gray-800 rounded-lg mb-4 overflow-hidden">
				<div
					class="absolute inset-0 flex items-center justify-center transition-all duration-500"
					:class="[
						`transition-${selectedTransition}`,
						{ 'opacity-0 translate-x-4': isAnimating },
					]"
				>
					<div class="text-center">
						<div class="text-3xl mb-1">{{ (currentSlideIndex % 2) + 1 }}</div>
						<div class="text-xs text-gray-400">Slide {{ (currentSlideIndex % 2) + 1 }}</div>
					</div>
				</div>
			</div>

			<!-- Transition list -->
			<div class="space-y-1 max-h-48 overflow-y-auto">
				<button
					v-for="transition in transitions"
					:key="transition.name"
					class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between"
					:class="selectedTransition === transition.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'"
					@click="previewTransition(transition.name)"
				>
					<div>
						<div class="font-medium">{{ transition.label }}</div>
						<div class="text-xs opacity-70">{{ transition.description }}</div>
					</div>
					<svg v-if="selectedTransition === transition.name" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.transition-slide {
	transform: translateX(0);
}

.transition-fade {
	opacity: 1;
}

.transition-zoom {
	transform: scale(1);
}

.transition-flip {
	transform: rotateY(0);
}

.transition-cube {
	transform: rotateX(0);
}

.opacity-0 {
	opacity: 0;
}

.translate-x-4 {
	transform: translateX(1rem);
}
</style>
