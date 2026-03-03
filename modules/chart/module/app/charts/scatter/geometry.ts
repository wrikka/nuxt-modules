import type { ScatterData, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate distance matrix for scatter plot points
 */
export function calculateDistanceMatrix(data: ScatterData): number[][] {
	const series = data.series[0];
	if (!series) return [];

	const points = series.data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	const matrix: number[][] = [];

	for (let i = 0; i < points.length; i++) {
		matrix[i] = [];
		for (let j = 0; j < points.length; j++) {
			const distance = Math.sqrt(
				Math.pow(points[i].x - points[j].x, 2) +
					Math.pow(points[i].y - points[j].y, 2),
			);
			matrix[i][j] = distance;
		}
	}

	return matrix;
}

/**
 * Calculate convex hull for scatter plot points
 */
export function calculateConvexHull(data: ScatterData): DataPoint[] {
	const series = data.series[0];
	if (!series) return [];

	const points = series.data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	if (points.length < 3) return points;

	// Simple convex hull implementation (Graham scan could be more efficient)
	const sorted = points.sort((a, b) => a.x - b.x || a.y - b.y);
	const hull: Array<{ x: number; y: number }> = [];

	// Build lower hull
	for (const point of sorted) {
		while (
			hull.length >= 2 &&
			cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
		) {
			hull.pop();
		}
		hull.push(point);
	}

	// Build upper hull
	const t = hull.length + 1;
	for (let i = sorted.length - 1; i >= 0; i--) {
		const point = sorted[i];
		while (
			hull.length >= t &&
			cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
		) {
			hull.pop();
		}
		hull.push(point);
	}

	hull.pop(); // Remove duplicate last point

	return hull;
}

// Helper function for cross product
function cross(
	o: { x: number; y: number },
	a: { x: number; y: number },
	b: { x: number; y: number },
): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}


