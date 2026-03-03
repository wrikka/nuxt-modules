import type { ScatterData, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate correlation coefficient between x and y values
 */
export function calculateCorrelation(data: ScatterData): number {
	const series = data.series[0];
	if (!series) return 0;

	const points = series.data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	if (points.length < 2) return 0;

	const n = points.length;
	const sumX = points.reduce((sum, p) => sum + p.x, 0);
	const sumY = points.reduce((sum, p) => sum + p.y, 0);
	const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
	const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
	const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);

	const numerator = n * sumXY - sumX * sumY;
	const denominator = Math.sqrt(
		(n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY),
	);

	return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate linear regression line for scatter plot
 */
export function calculateRegressionLine(data: ScatterData): DataPoint[] {
	const series = data.series[0];
	if (!series) return [];

	const points = series.data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	if (points.length < 2) return [];

	const n = points.length;
	const sumX = points.reduce((sum, p) => sum + p.x, 0);
	const sumY = points.reduce((sum, p) => sum + p.y, 0);
	const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
	const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	const minX = Math.min(...points.map((p) => p.x));
	const maxX = Math.max(...points.map((p) => p.x));

	return [
		{ x: minX, y: slope * minX + intercept },
		{ x: maxX, y: slope * maxX + intercept },
	];
}


