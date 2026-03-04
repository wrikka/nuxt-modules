import type * as fabric from "fabric";
import { computed, ref } from "vue";

export interface ZoomConfig {
	minZoom: number;
	maxZoom: number;
	zoomStep: number;
	smoothZoom: boolean;
	zoomDuration: number;
}

export const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
	minZoom: 0.1,
	maxZoom: 5,
	zoomStep: 0.1,
	smoothZoom: true,
	zoomDuration: 200,
};

export function useZoomControls(canvas: Ref<fabric.Canvas | null>, config: Partial<ZoomConfig> = {}) {
	const settings = ref<ZoomConfig>({ ...DEFAULT_ZOOM_CONFIG, ...config });
	const currentZoom = ref(1);
	const isAnimating = ref(false);

	const zoomLevel = computed(() => currentZoom.value);
	const canZoomIn = computed(() => currentZoom.value < settings.value.maxZoom);
	const canZoomOut = computed(() => currentZoom.value > settings.value.minZoom);

	const setZoom = (zoom: number, center?: { x: number; y: number }) => {
		if (!canvas.value) return;

		const clampedZoom = Math.max(settings.value.minZoom, Math.min(settings.value.maxZoom, zoom));

		if (center) {
			const point = new (canvas.value.constructor as any).Point(center.x, center.y);
			canvas.value.zoomToPoint(point, clampedZoom);
		} else {
			canvas.value.setZoom(clampedZoom);
		}

		currentZoom.value = clampedZoom;
		canvas.value.renderAll();
	};

	const animateZoom = (targetZoom: number, center?: { x: number; y: number }) => {
		if (!canvas.value || isAnimating.value) return;

		const clampedTargetZoom = Math.max(settings.value.minZoom, Math.min(settings.value.maxZoom, targetZoom));
		const startZoom = currentZoom.value;
		const zoomDiff = clampedTargetZoom - startZoom;

		if (zoomDiff === 0) return;

		isAnimating.value = true;
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / settings.value.zoomDuration, 1);
			const easeProgress = 1 - Math.pow(1 - progress, 3);

			const newZoom = startZoom + zoomDiff * easeProgress;
			setZoom(newZoom, center);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				isAnimating.value = false;
			}
		};

		requestAnimationFrame(animate);
	};

	const zoomIn = (step?: number, center?: { x: number; y: number }) => {
		const zoomStep = step ?? settings.value.zoomStep;
		const targetZoom = currentZoom.value + zoomStep;

		if (settings.value.smoothZoom) {
			animateZoom(targetZoom, center);
		} else {
			setZoom(targetZoom, center);
		}
	};

	const zoomOut = (step?: number, center?: { x: number; y: number }) => {
		const zoomStep = step ?? settings.value.zoomStep;
		const targetZoom = currentZoom.value - zoomStep;

		if (settings.value.smoothZoom) {
			animateZoom(targetZoom, center);
		} else {
			setZoom(targetZoom, center);
		}
	};

	const zoomTo = (zoom: number, center?: { x: number; y: number }) => {
		if (settings.value.smoothZoom) {
			animateZoom(zoom, center);
		} else {
			setZoom(zoom, center);
		}
	};

	const resetZoom = () => {
		zoomTo(1);
	};

	const fitToScreen = () => {
		if (!canvas.value) return;

		const canvasWidth = canvas.value.width!;
		const canvasHeight = canvas.value.height!;
		const viewportWidth = canvas.value.getWidth();
		const viewportHeight = canvas.value.getHeight();

		const scaleX = viewportWidth / canvasWidth;
		const scaleY = viewportHeight / canvasHeight;
		const zoom = Math.min(scaleX, scaleY) * 0.9;

		zoomTo(zoom);
	};

	const fitToWidth = () => {
		if (!canvas.value) return;

		const canvasWidth = canvas.value.width!;
		const viewportWidth = canvas.value.getWidth();
		const zoom = (viewportWidth / canvasWidth) * 0.9;

		zoomTo(zoom);
	};

	const fitToHeight = () => {
		if (!canvas.value) return;

		const canvasHeight = canvas.value.height!;
		const viewportHeight = canvas.value.getHeight();
		const zoom = (viewportHeight / canvasHeight) * 0.9;

		zoomTo(zoom);
	};

	const zoomToSelection = () => {
		if (!canvas.value) return;

		const activeObject = canvas.value.getActiveObject();
		if (!activeObject) {
			fitToScreen();
			return;
		}

		const bounds = activeObject.getBoundingRect();
		const viewportWidth = canvas.value.getWidth();
		const viewportHeight = canvas.value.getHeight();

		const centerX = bounds.left + bounds.width / 2;
		const centerY = bounds.top + bounds.height / 2;

		const scaleX = viewportWidth / bounds.width;
		const scaleY = viewportHeight / bounds.height;
		const zoom = Math.min(scaleX, scaleY) * 0.8;

		canvas.value.setViewportTransform([
			zoom,
			0,
			0,
			zoom,
			viewportWidth / 2 - centerX * zoom,
			viewportHeight / 2 - centerY * zoom,
		]);
		currentZoom.value = zoom;
		canvas.value.renderAll();
	};

	const zoomToElement = (element: any) => {
		if (!canvas.value || !element) return;

		const bounds = element.getBoundingRect();
		const viewportWidth = canvas.value.getWidth();
		const viewportHeight = canvas.value.getHeight();

		const centerX = bounds.left + bounds.width / 2;
		const centerY = bounds.top + bounds.height / 2;

		const scaleX = viewportWidth / bounds.width;
		const scaleY = viewportHeight / bounds.height;
		const zoom = Math.min(scaleX, scaleY) * 0.8;

		canvas.value.setViewportTransform([
			zoom,
			0,
			0,
			zoom,
			viewportWidth / 2 - centerX * zoom,
			viewportHeight / 2 - centerY * zoom,
		]);
		currentZoom.value = zoom;
		canvas.value.renderAll();
	};

	const zoomInAtPoint = (x: number, y: number) => {
		zoomIn(undefined, { x, y });
	};

	const zoomOutAtPoint = (x: number, y: number) => {
		zoomOut(undefined, { x, y });
	};

	const updateConfig = (newConfig: Partial<ZoomConfig>) => {
		settings.value = { ...settings.value, ...newConfig };
	};

	const getZoomPercentage = (): number => {
		return Math.round(currentZoom.value * 100);
	};

	const setZoomPercentage = (percentage: number) => {
		zoomTo(percentage / 100);
	};

	return {
		zoomLevel,
		canZoomIn,
		canZoomOut,
		isAnimating,
		setZoom,
		zoomIn,
		zoomOut,
		zoomTo,
		resetZoom,
		fitToScreen,
		fitToWidth,
		fitToHeight,
		zoomToSelection,
		zoomToElement,
		zoomInAtPoint,
		zoomOutAtPoint,
		updateConfig,
		getZoomPercentage,
		setZoomPercentage,
	};
}
