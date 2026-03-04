import { ref, computed, reactive, readonly } from "vue";
import type { DataPoint } from '@/module/app/types/chart-basic';

/**
 * Zoom state interface
 */
export interface ZoomState {
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	zoomLevel: number;
	panOffset: { x: number; y: number };
}

/**
 * Auto-scaling options
 */
export interface AutoScaleOptions {
	padding?: number;
	includeZero?: boolean;
	symmetric?: boolean;
	clampMin?: number;
	clampMax?: number;
}

/**
 * Zoom options
 */
export interface ZoomOptions {
	enableZoom?: boolean;
	enablePan?: boolean;
	zoomSensitivity?: number;
	minZoom?: number;
	maxZoom?: number;
	autoScaleOnDataChange?: boolean;
}

/**
 * Composable for chart auto-scaling and zooming
 */
export function useChartZoom(
	data: DataPoint[],
	options: ZoomOptions & AutoScaleOptions = {},
) {
	const {
		enableZoom = true,
		enablePan = true,
		zoomSensitivity = 0.1,
		minZoom = 0.1,
		maxZoom = 10,
		autoScaleOnDataChange = true,
		padding = 0.1,
		includeZero = false,
		symmetric = false,
		clampMin,
		clampMax,
	} = options;

	const zoomState = reactive<ZoomState>({
		xMin: 0,
		xMax: 100,
		yMin: 0,
		yMax: 100,
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
	});

	const originalBounds = ref<{
		xMin: number;
		xMax: number;
		yMin: number;
		yMax: number;
	} | null>(null);

	/**
	 * Calculate data bounds with padding
	 */
	const calculateBounds = (
		points: DataPoint[],
	): { xMin: number; xMax: number; yMin: number; yMax: number } => {
		if (points.length === 0) {
			return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
		}

		let xValues: number[] = [];
		let yValues: number[] = [];

		points.forEach((point) => {
			const x = typeof point.x === "number" ? point.x : 0;
			const y = typeof point.y === "number" ? point.y : 0;

			xValues.push(x);
			yValues.push(y);
		});

		const xMin = Math.min(...xValues);
		const xMax = Math.max(...xValues);
		const yMin = Math.min(...yValues);
		const yMax = Math.max(...yValues);

		// Apply padding
		const xRange = xMax - xMin || 1;
		const yRange = yMax - yMin || 1;
		const xPadding = xRange * padding;
		const yPadding = yRange * padding;

		let finalXMin = xMin - xPadding;
		let finalXMax = xMax + xPadding;
		let finalYMin = yMin - yPadding;
		let finalYMax = yMax + yPadding;

		// Include zero if requested
		if (includeZero) {
			finalXMin = Math.min(finalXMin, 0);
			finalYMin = Math.min(finalYMin, 0);
		}

		// Symmetric scaling
		if (symmetric) {
			const xCenter = (finalXMin + finalXMax) / 2;
			const yCenter = (finalYMin + finalYMax) / 2;
			const xRadius = Math.max(
				Math.abs(finalXMin - xCenter),
				Math.abs(finalXMax - xCenter),
			);
			const yRadius = Math.max(
				Math.abs(finalYMin - yCenter),
				Math.abs(finalYMax - yCenter),
			);

			finalXMin = xCenter - xRadius;
			finalXMax = xCenter + xRadius;
			finalYMin = yCenter - yRadius;
			finalYMax = yCenter + yRadius;
		}

		// Apply clamps
		if (clampMin !== undefined) {
			finalXMin = Math.max(finalXMin, clampMin);
			finalYMin = Math.max(finalYMin, clampMin);
		}
		if (clampMax !== undefined) {
			finalXMax = Math.min(finalXMax, clampMax);
			finalYMax = Math.min(finalYMax, clampMax);
		}

		return {
			xMin: finalXMin,
			xMax: finalXMax,
			yMin: finalYMin,
			yMax: finalYMax,
		};
	};

	/**
	 * Auto-scale to fit all data
	 */
	const autoScale = () => {
		const bounds = calculateBounds(data);
		originalBounds.value = bounds;

		zoomState.xMin = bounds.xMin;
		zoomState.xMax = bounds.xMax;
		zoomState.yMin = bounds.yMin;
		zoomState.yMax = bounds.yMax;
		zoomState.zoomLevel = 1;
		zoomState.panOffset = { x: 0, y: 0 };
	};

	/**
	 * Zoom in/out around a point
	 */
	const zoom = (factor: number, centerX?: number, centerY?: number) => {
		if (!enableZoom) return;

		const newZoomLevel = Math.max(
			minZoom,
			Math.min(maxZoom, zoomState.zoomLevel * factor),
		);

		if (newZoomLevel === zoomState.zoomLevel) return;

		const zoomChange = newZoomLevel / zoomState.zoomLevel;

		// Calculate zoom center
		const centerXPos = centerX ?? (zoomState.xMin + zoomState.xMax) / 2;
		const centerYPos = centerY ?? (zoomState.yMin + zoomState.yMax) / 2;

		// Adjust bounds based on zoom
		const xRange = zoomState.xMax - zoomState.xMin;
		const yRange = zoomState.yMax - zoomState.yMin;

		const newXRange = xRange / zoomChange;
		const newYRange = yRange / zoomChange;

		zoomState.xMin = centerXPos - newXRange / 2;
		zoomState.xMax = centerXPos + newXRange / 2;
		zoomState.yMin = centerYPos - newYRange / 2;
		zoomState.yMax = centerYPos + newYRange / 2;
		zoomState.zoomLevel = newZoomLevel;
	};

	/**
	 * Pan the view
	 */
	const pan = (deltaX: number, deltaY: number) => {
		if (!enablePan) return;

		zoomState.panOffset.x += deltaX;
		zoomState.panOffset.y += deltaY;

		zoomState.xMin += deltaX;
		zoomState.xMax += deltaX;
		zoomState.yMin += deltaY;
		zoomState.yMax += deltaY;
	};

	/**
	 * Reset zoom and pan
	 */
	const resetZoom = () => {
		if (originalBounds.value) {
			zoomState.xMin = originalBounds.value.xMin;
			zoomState.xMax = originalBounds.value.xMax;
			zoomState.yMin = originalBounds.value.yMin;
			zoomState.yMax = originalBounds.value.yMax;
			zoomState.zoomLevel = 1;
			zoomState.panOffset = { x: 0, y: 0 };
		} else {
			autoScale();
		}
	};

	/**
	 * Zoom to fit specific bounds
	 */
	const zoomToBounds = (
		xMin: number,
		xMax: number,
		yMin: number,
		yMax: number,
	) => {
		zoomState.xMin = xMin;
		zoomState.xMax = xMax;
		zoomState.yMin = yMin;
		zoomState.yMax = yMax;

		// Calculate zoom level based on original bounds
		if (originalBounds.value) {
			const originalXRange =
				originalBounds.value.xMax - originalBounds.value.xMin;
			const originalYRange =
				originalBounds.value.yMax - originalBounds.value.yMin;
			const currentXRange = xMax - xMin;
			const currentYRange = yMax - yMin;

			const xZoom = originalXRange / currentXRange;
			const yZoom = originalYRange / currentYRange;
			zoomState.zoomLevel = Math.min(xZoom, yZoom);
		}
	};

	/**
	 * Get transformed point for rendering
	 */
	const transformPoint = (point: DataPoint) => {
		const x = typeof point.x === "number" ? point.x : 0;
		const y = typeof point.y === "number" ? point.y : 0;

		return {
			x: x,
			y: y,
			transformedX: x, // In a real implementation, apply zoom/pan transformation
			transformedY: y,
		};
	};

	// Auto-scale when data changes
	if (autoScaleOnDataChange) {
		autoScale();
	}

	return {
		zoomState: readonly(zoomState),
		autoScale,
		zoom,
		pan,
		resetZoom,
		zoomToBounds,
		transformPoint,
	};
}
