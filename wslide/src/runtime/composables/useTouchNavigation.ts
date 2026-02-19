import { onMounted, onUnmounted } from "vue";
import type { SlideDeckComposable } from "./useSlideDeck";

export function useTouchNavigation(deck: SlideDeckComposable) {
	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
		touchStartTime = Date.now();
	}

	function handleTouchEnd(event: TouchEvent) {
		const touchEndX = event.changedTouches[0].clientX;
		const touchEndY = event.changedTouches[0].clientY;
		const deltaX = touchStartX - touchEndX;
		const deltaY = touchStartY - touchEndY;
		const deltaTime = Date.now() - touchStartTime;

		// Fast swipe detection (under 300ms)
		const _isFastSwipe = deltaTime < 300;

		// Horizontal swipe
		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
			if (deltaX > 0) {
				deck.next();
			} else {
				deck.prev();
			}
		}

		// Double tap detection for overview
		if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
			// Could add double tap logic here
		}
	}

	function handleTouchMove(event: TouchEvent) {
		// Prevent default scrolling when in presentation mode
		if (!deck.isOverviewOpen.value) {
			event.preventDefault();
		}
	}

	onMounted(() => {
		document.addEventListener("touchstart", handleTouchStart, { passive: true });
		document.addEventListener("touchend", handleTouchEnd, { passive: true });
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
	});

	onUnmounted(() => {
		document.removeEventListener("touchstart", handleTouchStart);
		document.removeEventListener("touchend", handleTouchEnd);
		document.removeEventListener("touchmove", handleTouchMove);
	});
}
