import { calculateMedian } from "../utils/math-utils";

/**
 * Calculate optimal number of bins using various methods
 */
export function calculateOptimalBins(
	values: number[],
	method: "sturges" | "scott" | "freedman-diaconis" | "sqrt" = "sturges",
): number {
	const n = values.length;
	if (n === 0) return 1;

	switch (method) {
		case "sturges":
			return Math.ceil(Math.log2(n) + 1);

		case "scott": {
			const std = calculateStandardDeviation(values);
			const iqr = calculateIQR(values);
			const binWidth = (3.5 * std) / Math.pow(n, 1 / 3);
			const range = Math.max(...values) - Math.min(...values);
			return Math.ceil(range / binWidth);
		}

		case "freedman-diaconis": {
			const iqr = calculateIQR(values);
			const binWidth = (2 * iqr) / Math.pow(n, 1 / 3);
			const range = Math.max(...values) - Math.min(...values);
			return binWidth > 0 ? Math.ceil(range / binWidth) : 1;
		}

		case "sqrt":
			return Math.ceil(Math.sqrt(n));

		default:
			return Math.ceil(Math.log2(n) + 1);
	}
}

// Helper functions for statistical calculations
function calculateStandardDeviation(values: number[]): number {
	const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
	const variance =
		values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
		values.length;
	return Math.sqrt(variance);
}

function calculateIQR(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const q1 = sorted[Math.floor(sorted.length * 0.25)];
	const q3 = sorted[Math.floor(sorted.length * 0.75)];
	return q3 - q1;
}

/**
 * Calculate histogram statistics
 */
export function calculateHistogramStats(values: number[], bins: number = 10) {
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min;
	const binWidth = range / bins;

	const binCounts: number[] = new Array(bins).fill(0);

	values.forEach((value) => {
		const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
		binCounts[binIndex]++;
	});

	const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
	const median = calculateMedian(values);
	const mode = calculateMode(binCounts, binWidth, min);

	return {
		min,
		max,
		range,
		binWidth,
		mean,
		median,
		mode,
		totalCount: values.length,
		maxFrequency: Math.max(...binCounts),
		binCounts,
	};
}

// Helper functions

function calculateMode(
	binCounts: number[],
	binWidth: number,
	min: number,
): number {
	const maxCount = Math.max(...binCounts);
	const modeIndex = binCounts.indexOf(maxCount);
	return min + modeIndex * binWidth + binWidth / 2;
}


