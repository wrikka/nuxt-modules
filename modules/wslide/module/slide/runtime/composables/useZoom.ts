import { onUnmounted, readonly, ref } from "vue";

const zoomLevel = ref(1);
const zoomPosition = ref({ x: 0, y: 0 });
const isZooming = ref(false);

export function useZoom() {
	function zoomIn(centerX?: number, centerY?: number) {
		zoomLevel.value = Math.min(zoomLevel.value * 1.2, 5);
		if (centerX !== undefined && centerY !== undefined) {
			zoomPosition.value = { x: centerX, y: centerY };
		}
	}

	function zoomOut() {
		zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.5);
		if (zoomLevel.value === 1) {
			zoomPosition.value = { x: 0, y: 0 };
		}
	}

	function resetZoom() {
		zoomLevel.value = 1;
		zoomPosition.value = { x: 0, y: 0 };
	}

	function setZoom(level: number, x?: number, y?: number) {
		zoomLevel.value = Math.max(0.5, Math.min(level, 5));
		if (x !== undefined && y !== undefined) {
			zoomPosition.value = { x, y };
		}
	}

	function handleWheel(event: WheelEvent) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			if (event.deltaY < 0) {
				zoomIn(event.clientX, event.clientY);
			} else {
				zoomOut();
			}
		}
	}

	onUnmounted(() => {
		resetZoom();
	});

	return {
		zoomLevel: readonly(zoomLevel),
		zoomPosition: readonly(zoomPosition),
		isZooming: readonly(isZooming),
		zoomIn,
		zoomOut,
		resetZoom,
		setZoom,
		handleWheel,
	};
}
