import * as fabric from "fabric";
import { computed, ref } from "vue";

export interface UseDesignerZoomOptions {
	getCanvas: () => fabric.Canvas | null;
	artboard: { width: number; height: number };
}

export const useDesignerZoom = (options: UseDesignerZoomOptions) => {
	let isPanning = false;
	let lastPanX = 0;
	let lastPanY = 0;

	const zoom = (factor: number) => {
		const c = options.getCanvas();
		if (!c) return;
		const newZoom = c.getZoom() * factor;
		c.setZoom(newZoom);
		c.renderAll();
	};

	const setZoom = (zoomLevel: number) => {
		const c = options.getCanvas();
		if (!c) return;
		c.setZoom(zoomLevel);
		c.renderAll();
	};

	const zoomIn = () => zoom(1.1);
	const zoomOut = () => zoom(0.9);
	const resetZoom = () => setZoom(1);

	const fitToViewport = (viewportWidth: number, viewportHeight: number, padding: number = 32) => {
		const c = options.getCanvas();
		if (!c) return;
		if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight)) return;
		if (viewportWidth <= 0 || viewportHeight <= 0) return;

		const availableWidth = Math.max(0, viewportWidth - padding * 2);
		const availableHeight = Math.max(0, viewportHeight - padding * 2);
		if (availableWidth <= 0 || availableHeight <= 0) return;

		const artW = Math.max(1, options.artboard.width);
		const artH = Math.max(1, options.artboard.height);

		const targetZoom = Math.min(availableWidth / artW, availableHeight / artH);
		const clampedZoom = Math.max(0.05, Math.min(6, targetZoom));

		c.setZoom(clampedZoom);

		const canvasW = c.getWidth();
		const canvasH = c.getHeight();
		const contentW = artW * clampedZoom;
		const contentH = artH * clampedZoom;
		const left = (canvasW - contentW) / 2;
		const top = (canvasH - contentH) / 2;

		c.viewportTransform = [clampedZoom, 0, 0, clampedZoom, left, top];
		c.renderAll();
	};

	const zoomLevel = computed(() => {
		const c = options.getCanvas();
		return c ? c.getZoom() : 1;
	});

	const handleWheel = (e: WheelEvent) => {
		const c = options.getCanvas();
		if (!c) return;

		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			zoom(delta);
		}
	};

	const handleMouseDown = (e: MouseEvent, isEyedropperMode: boolean, isPenMode: boolean) => {
		if (isEyedropperMode || isPenMode) return;

		if (e.buttons === 4 || (e.buttons === 1 && e.altKey)) {
			isPanning = true;
			lastPanX = e.clientX;
			lastPanY = e.clientY;
			e.preventDefault();
		}
	};

	const handleMouseMove = (e: MouseEvent, isPenMode: boolean, currentPath: fabric.Polyline | null) => {
		if (isPenMode && currentPath) return;

		if (!isPanning) return;
		const c = options.getCanvas();
		if (!c) return;

		const deltaX = e.clientX - lastPanX;
		const deltaY = e.clientY - lastPanY;

		const viewportTransform = c.viewportTransform;
		if (viewportTransform) {
			viewportTransform[4] += deltaX;
			viewportTransform[5] += deltaY;
			c.renderAll();
		}

		lastPanX = e.clientX;
		lastPanY = e.clientY;
	};

	const handleMouseUp = () => {
		isPanning = false;
	};

	return {
		zoom,
		setZoom,
		zoomIn,
		zoomOut,
		resetZoom,
		fitToViewport,
		zoomLevel,
		handleWheel,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	};
};
