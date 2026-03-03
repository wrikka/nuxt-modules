<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
	useAutoplay,
	useKeyboardNavigation,
	useLaserPointer,
	useRecording,
	useSlideDeck,
	useSpotlight,
	useTimer,
	useTouchNavigation,
	useZoom,
} from "../composables";
import type { SlideDeck } from "../types";

interface Props {
	deck: SlideDeck;
	initialSlide?: number;
}

const props = withDefaults(defineProps<Props>(), {
	initialSlide: 0,
});

const deck = useSlideDeck(props.deck);
const containerRef = ref<HTMLElement>();
const zoom = useZoom();
const spotlight = useSpotlight();
const laser = useLaserPointer();
const timer = useTimer();
const recording = useRecording();
const autoplay = useAutoplay();
const showShortcuts = ref(false);
const showOverview = ref(false);
const showQRCode = ref(false);
const showCamera = ref(false);

// Current URL for QR code (SSR compatible)
const currentUrl = computed(() => {
	if (process.client) {
		return window.location.href;
	}
	return "";
});

// Initialize keyboard navigation with extended shortcuts
useKeyboardNavigation(deck);
useTouchNavigation(deck);

const classes = computed(() => ({
	"relative w-screen h-screen overflow-hidden bg-wslide-bg text-wslide-text font-sans": true,
	[`theme-${props.deck.theme ?? "default"}`]: true,
}));

watch(
	() => props.initialSlide,
	(index) => {
		if (index !== undefined) {
			deck.goToSlide(index);
		}
	},
	{ immediate: true },
);

defineExpose({
	deck,
	goToSlide: deck.goToSlide,
	next: deck.next,
	prev: deck.prev,
});
</script>

<template>
	<div ref="containerRef" :class="classes">
		<div class="absolute inset-0 flex items-center justify-center">
			<!-- Zoom wrapper -->
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform duration-200"
				:style="{ transform: `scale(${zoom.zoomLevel.value})` }"
				@wheel="zoom.handleWheel"
			>
				<Transition name="slide" mode="out-in">
					<slot
						name="slide"
						:slide="deck.currentSlide.value"
						:index="deck.currentSlideIndex.value"
					>
						<WSlideSlide
							:key="deck.currentSlide.value?.id"
							:slide="deck.currentSlide.value!"
							:current-click="deck.currentClick.value"
						/>
					</slot>
				</Transition>
			</div>

			<!-- Feature overlays -->
			<WSlideSpotlight />
			<WSlideLaser />
			<WSlideDrawing :slide-id="deck.currentSlide.value?.id || ''" />
			<WSlideRecording />
			<WSlideTimer />
			<WSlideZoom />
			<WSlideCamera ref="cameraRef" v-if="showCamera" />

			<!-- Overview modal -->
			<WSlideOverview
				:slides="[...deck.slides.value]"
				:current-index="deck.currentSlideIndex.value"
				:is-open="showOverview"
				@select="deck.goToSlide"
				@close="showOverview = false"
			/>

			<!-- Shortcuts modal -->
			<WSlideShortcuts
				:is-open="showShortcuts"
				@close="showShortcuts = false"
			/>

			<!-- QR Code modal -->
			<WSlideQRCode
				v-if="showQRCode"
				:url="currentUrl"
				@close="showQRCode = false"
			/>

			<slot name="controls" :deck="deck">
				<WSlideControls :deck="deck" />
			</slot>

			<slot name="progress" :progress="deck.progress.value">
				<WSlideProgress :progress="deck.progress.value" />
			</slot>
		</div>
	</div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
	opacity: 0;
	transform: translateX(50px);
}

.slide-leave-to {
	opacity: 0;
	transform: translateX(-50px);
}
</style>
