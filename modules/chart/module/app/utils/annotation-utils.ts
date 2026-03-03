import type { AnnotationPosition } from "../types/annotations";
import type { DataPoint } from '@/module/app/types/chart-basic';

/**
 * Convert annotation position to pixel coordinates
 */
export const getPixelPosition = (
	position: AnnotationPosition,
	chartBounds: {
		width: number;
		height: number;
		xMin: number;
		xMax: number;
		yMin: number;
		yMax: number;
	},
	dataPoints?: DataPoint[],
	snapToGrid = false,
	gridSize = 10,
): { x: number; y: number } => {
	let x: number, y: number;

	switch (position.type) {
		case "absolute":
			x = position.x as number;
			y = position.y as number;
			break;

		case "percentage":
			x = ((position.x as number) / 100) * chartBounds.width;
			y = ((position.y as number) / 100) * chartBounds.height;
			break;

		case "relative":
			if (dataPoints) {
				// Find closest data point
				const targetPoint = dataPoints.find(
					(point) => point.x === position.x || point.label === position.x,
				);
				if (targetPoint) {
					// Convert data coordinates to pixels (simplified)
					const xRatio =
						(Number(targetPoint.x) - chartBounds.xMin) /
						(chartBounds.xMax - chartBounds.xMin);
					const yRatio =
						(Number(targetPoint.y) - chartBounds.yMin) /
						(chartBounds.yMax - chartBounds.yMin);
					x = xRatio * chartBounds.width;
					y = chartBounds.height - yRatio * chartBounds.height; // Flip Y axis
				} else {
					x = 0;
					y = 0;
				}
			} else {
				x = 0;
				y = 0;
			}
			break;

		default:
			x = 0;
			y = 0;
	}

	// Apply offsets
	x += position.xOffset || 0;
	y += position.yOffset || 0;

	// Snap to grid if enabled
	if (snapToGrid) {
		x = Math.round(x / gridSize) * gridSize;
		y = Math.round(y / gridSize) * gridSize;
	}

	return { x, y };
};
