import { calculateMedian } from "../math-utils";

/**
 * Calculate box plot statistics (five-number summary)
 */
export function calculateBoxplotStatistics(values: number[]): {
	min: number;
	q1: number;
	median: number;
	q3: number;
	max: number;
	iqr: number;
	outliers: number[];
	mean: number;
} {
	if (values.length === 0) {
		return {
			min: 0,
			q1: 0,
			median: 0,
			q3: 0,
			max: 0,
			iqr: 0,
			outliers: [],
			mean: 0,
		};
	}

	const sorted = [...values].sort((a, b) => a - b);
	const n = sorted.length;

	const min = sorted[0];
	const max = sorted[n - 1];
	const median = calculateMedian(sorted);
	const q1 = calculateMedian(sorted.slice(0, Math.floor(n / 2)));
	const q3 = calculateMedian(sorted.slice(Math.ceil(n / 2)));
	const iqr = q3 - q1;
	const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

	// Calculate outliers using 1.5 * IQR rule
	const lowerFence = q1 - 1.5 * iqr;
	const upperFence = q3 + 1.5 * iqr;

	const outliers = sorted.filter((val) => val < lowerFence || val > upperFence);

	return {
		min,
		q1,
		median,
		q3,
		max,
		iqr,
		outliers,
		mean,
	};
}

/**
 * Calculate box plot whiskers positions
 */
export function calculateBoxplotWhiskers(
	values: number[],
	method: "min-max" | "iqr" = "iqr",
): { lowerWhisker: number; upperWhisker: number; outliers: number[] } {
	const stats = calculateBoxplotStatistics(values);

	if (method === "min-max") {
		return {
			lowerWhisker: stats.min,
			upperWhisker: stats.max,
			outliers: [],
		};
	}

	// IQR method
	const lowerFence = stats.q1 - 1.5 * stats.iqr;
	const upperFence = stats.q3 + 1.5 * stats.iqr;

	const lowerWhisker = Math.max(stats.min, lowerFence);
	const upperWhisker = Math.min(stats.max, upperFence);

	const outliers = values.filter((val) => val < lowerFence || val > upperFence);

	return {
		lowerWhisker,
		upperWhisker,
		outliers,
	};
}

/**
 * Calculate box plot skewness
 */
export function calculateBoxplotSkewness(values: number[]): number {
	const stats = calculateBoxplotStatistics(values);
	const mean = stats.mean;
	const median = stats.median;

	// Simple skewness measure: (mean - median) / IQR
	return stats.iqr === 0 ? 0 : (mean - median) / stats.iqr;
}
