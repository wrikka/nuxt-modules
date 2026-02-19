import { onMounted, onUnmounted } from "vue";
import type { SlideDeckComposable } from "./useSlideDeck";

export function useKeyboardNavigation(deck: SlideDeckComposable) {
	function handleKeydown(event: KeyboardEvent) {
		// Don't intercept if user is typing in an input
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		switch (event.key) {
			// Navigation
			case "ArrowRight":
			case "ArrowDown":
			case " ":
			case "PageDown":
				event.preventDefault();
				deck.next();
				break;
			case "ArrowLeft":
			case "ArrowUp":
			case "PageUp":
				event.preventDefault();
				deck.prev();
				break;
			case "Home":
				event.preventDefault();
				deck.goToFirst();
				break;
			case "End":
				event.preventDefault();
				deck.goToLast();
				break;

			// Feature toggles
			case "o":
				if (!event.ctrlKey && !event.metaKey) {
					event.preventDefault();
					deck.toggleOverview();
				}
				break;
			case "t":
				event.preventDefault();
				if (deck.isTimerRunning.value) {
					deck.stopTimer();
				} else {
					deck.startTimer();
				}
				break;
			case "s":
				event.preventDefault();
				deck.toggleSpotlight();
				break;
			case "l":
				event.preventDefault();
				deck.toggleLaser();
				break;
			case "d":
				event.preventDefault();
				deck.toggleDrawing();
				break;
			case "a":
				event.preventDefault();
				deck.toggleAutoplay();
				break;
			case "r":
				event.preventDefault();
				deck.toggleRecording();
				break;
			case "?":
			case "h":
				event.preventDefault();
				deck.showShortcuts();
				break;
			case "Escape":
				event.preventDefault();
				if (deck.isOverviewOpen.value) deck.toggleOverview();
				if (deck.shortcutsVisible.value) deck.hideShortcuts();
				break;
			case "0":
				event.preventDefault();
				deck.setZoom(1);
				break;
		}
	}

	onMounted(() => {
		window.addEventListener("keydown", handleKeydown);
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeydown);
	});
}
