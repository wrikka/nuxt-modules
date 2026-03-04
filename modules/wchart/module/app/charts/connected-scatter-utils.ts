import type { DataPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate trend line for connected scatter
 */
export function calculateTrendLine(
	points: Array<{ x: string | number; y: number }>,
): DataPoint[] | null {
	// Convert x values to numbers for calculation
	const numericPoints: Array<{ x: number; y: number }> = [];

	points.forEach((point) => {
		let xNum: number;
		if (typeof point.x === "number") {
			xNum = point.x;
		} else if (typeof point.x === "string") {
			// Try to parse as number
			const parsed = parseFloat(point.x);
			if (!isNaN(parsed)) {
				xNum = parsed;
			} else {
				return; // Skip non-numeric x values
			}
		} else {
			return; // Skip other types
		}

		numericPoints.push({ x: xNum, y: point.y });
	});

	if (numericPoints.length < 2) return null;

	// Calculate linear regression
	const n = numericPoints.length;
	const sumX = numericPoints.reduce((sum, p) => sum + p.x, 0);
	const sumY = numericPoints.reduce((sum, p) => sum + p.y, 0);
	const sumXY = numericPoints.reduce((sum, p) => sum + p.x * p.y, 0);
	const sumXX = numericPoints.reduce((sum, p) => sum + p.x * p.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	// Generate trend line points
	const xMin = Math.min(...numericPoints.map((p) => p.x));
	const xMax = Math.max(...numericPoints.map((p) => p.x));

	return [
		{ x: xMin, y: slope * xMin + intercept, color: "#ff6b6b" },
		{ x: xMax, y: slope * xMax + intercept, color: "#ff6b6b" },
	];
}

/**
 * Calculate regression line
 */
export function calculateRegressionLine(
	points: Array<{ x: string | number; y: number }>,
): DataPoint[] | null {
	return calculateTrendLine(points);
}


