/**
 * Mathematical utility functions for charts
 */

/**
 * Calculate the median of an array of numbers
 */
export function calculateMedian(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
}
