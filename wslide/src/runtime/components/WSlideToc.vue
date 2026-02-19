<script setup lang="ts">
import { computed, ref } from "vue";
import { useSlideDeck } from "../composables/useWSlide";

interface Props {
	deck: ReturnType<typeof useSlideDeck>;
}

const props = defineProps<Props>();

const isOpen = ref(false);
const searchQuery = ref("");

const filteredSlides = computed(() => {
	if (!searchQuery.value) return props.deck.slides.value;
	const query = searchQuery.value.toLowerCase();
	return props.deck.slides.value.filter((slide) =>
		slide.content.toLowerCase().includes(query) ||
		slide.frontmatter.title?.toLowerCase().includes(query),
	);
});

function goToSlide(index: number) {
	props.deck.goToSlide(index);
	isOpen.value = false;
	searchQuery.value = "";
}

function toggle() {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div class="fixed top-4 left-4 z-100">
		<button
			class="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border-none text-white cursor-pointer rounded-full transition-colors hover:bg-white/10"
			@click="toggle"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>

		<Transition name="toc">
			<div
				v-if="isOpen"
				class="absolute top-12 left-0 w-70 max-h-[70vh] bg-black/90 backdrop-blur-xl overflow-hidden flex flex-col rounded-xl"
			>
				<div class="p-4 border-b border-white/10">
					<h3 class="m-0 mb-3 text-base">Slides</h3>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search slides..."
						class="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md text-white text-sm outline-none focus:border-wslide-primary placeholder-white/40"
					>
				</div>

				<div class="overflow-y-auto p-2">
					<button
						v-for="slide in filteredSlides"
						:key="slide.id"
						class="flex items-center gap-3 w-full px-3 py-3 bg-transparent border-none text-white cursor-pointer rounded-lg transition-colors text-left hover:bg-white/10"
						:class="{ 'bg-wslide-primary!': slide.index === deck.currentSlideIndex.value }"
						@click="goToSlide(slide.index)"
					>
						<span class="w-6 h-6 flex items-center justify-center bg-white/10 rounded text-xs font-semibold">{{ slide.index + 1 }}</span>
						<span class="flex-1 text-sm truncate">
							{{ slide.frontmatter.title || `Slide ${slide.index + 1}` }}
						</span>
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.toc-enter-active,
.toc-leave-active {
	@apply transition-all duration-200 ease-out;
}

.toc-enter-from,
.toc-leave-to {
	@apply opacity-0 -translate-y-2;
}
</style>
