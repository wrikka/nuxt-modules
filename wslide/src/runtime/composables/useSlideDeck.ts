import { computed, readonly, ref } from "vue";
import type { Slide, SlideDeck } from "../types";

const currentSlideIndex = ref(0);
const currentClick = ref(0);
const slides = ref<Slide[]>([]);
const isPresenterMode = ref(false);
const isOverviewOpen = ref(false);
const isTimerRunning = ref(false);
const timerSeconds = ref(0);
const isSpotlightActive = ref(false);
const spotlightPosition = ref({ x: 0, y: 0 });
const isLaserActive = ref(false);
const laserPosition = ref({ x: 0, y: 0 });
const isDrawingMode = ref(false);
const drawings = ref<DrawingStroke[]>([]);
const zoomLevel = ref(1);
const zoomPosition = ref({ x: 0, y: 0 });
const isRecording = ref(false);
const recordingTime = ref(0);
const autoplayEnabled = ref(false);
const autoplayInterval = ref<number | null>(null);
const shortcutsVisible = ref(false);

interface DrawingStroke {
	slideId: string;
	points: { x: number; y: number }[];
	color: string;
	width: number;
}

export function useSlideDeck(deckData?: SlideDeck) {
	if (deckData) {
		slides.value = deckData.slides;
	}

	const currentSlide = computed(() => slides.value[currentSlideIndex.value]);
	const totalSlides = computed(() => slides.value.length);
	const hasNextSlide = computed(() => currentSlideIndex.value < totalSlides.value - 1);
	const hasPrevSlide = computed(() => currentSlideIndex.value > 0);
	const hasNextClick = computed(() => currentClick.value < (currentSlide.value?.maxClicks ?? 0));
	const hasPrevClick = computed(() => currentClick.value > 0);
	const progress = computed(() => ((currentSlideIndex.value + 1) / totalSlides.value) * 100);

	function goToSlide(index: number) {
		if (index >= 0 && index < totalSlides.value) {
			currentSlideIndex.value = index;
			currentClick.value = 0;
		}
	}

	function next() {
		if (hasNextClick.value) {
			currentClick.value++;
		} else if (hasNextSlide.value) {
			currentSlideIndex.value++;
			currentClick.value = 0;
		}
	}

	function prev() {
		if (hasPrevClick.value) {
			currentClick.value--;
		} else if (hasPrevSlide.value) {
			currentSlideIndex.value--;
			currentClick.value = currentSlide.value?.maxClicks ?? 0;
		}
	}

	function goToFirst() {
		goToSlide(0);
	}

	function goToLast() {
		goToSlide(totalSlides.value - 1);
	}

	return {
		currentSlide,
		currentSlideIndex: readonly(currentSlideIndex),
		currentClick: readonly(currentClick),
		totalSlides,
		hasNextSlide,
		hasPrevSlide,
		hasNextClick,
		hasPrevClick,
		progress,
		goToSlide,
		next,
		prev,
		goToFirst,
		goToLast,
		slides: readonly(slides),
		isPresenterMode: readonly(isPresenterMode),
		// Feature states
		isOverviewOpen: readonly(isOverviewOpen),
		isTimerRunning: readonly(isTimerRunning),
		timerSeconds: readonly(timerSeconds),
		isSpotlightActive: readonly(isSpotlightActive),
		spotlightPosition: readonly(spotlightPosition),
		isLaserActive: readonly(isLaserActive),
		laserPosition: readonly(laserPosition),
		isDrawingMode: readonly(isDrawingMode),
		drawings: readonly(drawings),
		zoomLevel: readonly(zoomLevel),
		zoomPosition: readonly(zoomPosition),
		isRecording: readonly(isRecording),
		recordingTime: readonly(recordingTime),
		autoplayEnabled: readonly(autoplayEnabled),
		shortcutsVisible: readonly(shortcutsVisible),
		// Actions
		toggleOverview: () => isOverviewOpen.value = !isOverviewOpen.value,
		startTimer: () => isTimerRunning.value = true,
		stopTimer: () => isTimerRunning.value = false,
		resetTimer: () => timerSeconds.value = 0,
		toggleSpotlight: () => isSpotlightActive.value = !isSpotlightActive.value,
		updateSpotlightPosition: (x: number, y: number) => spotlightPosition.value = { x, y },
		toggleLaser: () => isLaserActive.value = !isLaserActive.value,
		updateLaserPosition: (x: number, y: number) => laserPosition.value = { x, y },
		toggleDrawing: () => isDrawingMode.value = !isDrawingMode.value,
		addDrawingStroke: (stroke: DrawingStroke) => drawings.value.push(stroke),
		clearDrawings: () => drawings.value = [],
		setZoom: (level: number, x?: number, y?: number) => {
			zoomLevel.value = level;
			if (x !== undefined && y !== undefined) zoomPosition.value = { x, y };
		},
		toggleRecording: () => isRecording.value = !isRecording.value,
		toggleAutoplay: () => {
			autoplayEnabled.value = !autoplayEnabled.value;
			if (autoplayEnabled.value && autoplayInterval.value) {
				window.clearInterval(autoplayInterval.value);
				autoplayInterval.value = null;
			}
		},
		showShortcuts: () => shortcutsVisible.value = true,
		hideShortcuts: () => shortcutsVisible.value = false,
	};
}

export type SlideDeckComposable = ReturnType<typeof useSlideDeck>;
