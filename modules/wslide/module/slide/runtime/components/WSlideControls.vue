<script setup lang="ts">
import type { useSlideDeck } from "../composables/useSlideDeck";

interface Props {
	deck: ReturnType<typeof useSlideDeck>;
}

defineProps<Props>();
</script>

<template>
	<div class="fixed bottom-8 right-8 flex items-center gap-4 z-100 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
		<button
			class="w-10 h-10 flex items-center justify-center bg-transparent border-none text-white cursor-pointer rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
			:disabled="!deck.hasPrevSlide.value && !deck.hasPrevClick.value"
			@click="deck.prev()"
		>
			<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</button>

		<span class="text-sm font-medium min-w-16 text-center tabular-nums">
			{{ deck.currentSlideIndex.value + 1 }} / {{ deck.totalSlides.value }}
		</span>

		<button
			class="w-10 h-10 flex items-center justify-center bg-transparent border-none text-white cursor-pointer rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
			:disabled="!deck.hasNextSlide.value && !deck.hasNextClick.value"
			@click="deck.next()"
		>
			<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6" />
			</svg>
		</button>
	</div>
</template>

<style scoped>
button:active:not(:disabled) {
	transform: scale(0.95);
}
</style>
