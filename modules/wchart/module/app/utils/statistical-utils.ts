import type {
	StatisticalMeasure,
	StatisticalSummary,
	CorrelationResult,
} from "../types/statistics";

/**
 * Get percentile from sorted values
 */
export function getPercentile(
	sortedValues: number[],
	percentile: number,
): number {
	if (sortedValues.length === 0) return 0;
	if (percentile <= 0) return sortedValues[0];
	if (percentile >= 100) return sortedValues[sortedValues.length - 1];

	const index = (percentile / 100) * (sortedValues.length - 1);
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	const weight = index - lower;

	if (upper >= sortedValues.length)
		return sortedValues[sortedValues.length - 1];

	return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

/**
 * Get mode from values
 */
export function getMode(values: number[]): number[] {
	const frequency: { [key: number]: number } = {};
	values.forEach((value) => {
		frequency[value] = (frequency[value] || 0) + 1;
	});

	const maxFreq = Math.max(...Object.values(frequency));
	return Object.keys(frequency)
		.filter((key) => frequency[Number(key)] === maxFreq)
		.map(Number);
}

/**
 * Calculate skewness
 */
export function calculateSkewness(
	values: number[],
	mean: number,
	std: number,
): number {
	if (std === 0) return 0;
	const n = values.length;
	const skewness =
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 3), 0) /
		n;
	return skewness;
}

/**
 * Calculate kurtosis
 */
export function calculateKurtosis(
	values: number[],
	mean: number,
	std: number,
): number {
	if (std === 0) return 0;
	const n = values.length;
	const kurtosis =
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 4), 0) /
			n -
		3;
	return kurtosis;
}

/**
 * Classify distribution based on skewness and kurtosis
 */
export function classifyDistribution(
	skewness: number,
	kurtosis: number,
): StatisticalSummary["distribution"] {
	const absSkew = Math.abs(skewness);
	if (absSkew < 0.5 && Math.abs(kurtosis) < 0.5) return "normal";
	if (skewness > 0.5) return "skewed-right";
	if (skewness < -0.5) return "skewed-left";
	return "unknown";
}

/**
 * Calculate MAD (Median Absolute Deviation)
 */
export function calculateMAD(values: number[], median: number): number {
	const deviations = values.map((value) => Math.abs(value - median));
	return getPercentile(
		deviations.sort((a, b) => a - b),
		50,
	);
}

/**
 * Calculate Pearson correlation
 */
export function pearsonCorrelation(
	values1: number[],
	values2: number[],
): number {
	const n = values1.length;
	const sum1 = values1.reduce((a, b) => a + b, 0);
	const sum2 = values2.reduce((a, b) => a + b, 0);
	const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
	const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
	const sumProd = values1.reduce((a, b, i) => a + b * values2[i], 0);

	const numerator = n * sumProd - sum1 * sum2;
	const denominator = Math.sqrt(
		(n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2),
	);

	return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Get ranks for Spearman correlation
 */
export function getRanks(values: number[]): number[] {
	const sorted = [...values].sort((a, b) => a - b);
	return values.map((v) => sorted.indexOf(v) + 1);
}

/**
 * Format measure name for display
 */
export function formatMeasureName(measure: StatisticalMeasure): string {
	const names: Record<StatisticalMeasure, string> = {
		mean: "Mean",
		median: "Median",
		mode: "Mode",
		"standard-deviation": "Std Dev",
		variance: "Variance",
		min: "Minimum",
		max: "Maximum",
		range: "Range",
		quartiles: "Quartiles",
		percentiles: "Percentiles",
		skewness: "Skewness",
		kurtosis: "Kurtosis",
		correlation: "Correlation",
		covariance: "Covariance",
	};
	return names[measure] || measure;
}

/**
 * Get color for statistical measure
 */
export function getMeasureColor(measure: StatisticalMeasure): string {
	const colors: Record<StatisticalMeasure, string> = {
		mean: "#ff6b6b",
		median: "#4ecdc4",
		mode: "#45b7d1",
		"standard-deviation": "#f9ca24",
		variance: "#f0932b",
		min: "#eb4d4b",
		max: "#6c5ce7",
		range: "#a29bfe",
		quartiles: "#fd79a8",
		percentiles: "#e17055",
		skewness: "#00b894",
		kurtosis: "#00cec9",
		correlation: "#d63031",
		covariance: "#e84393",
	};
	return colors[measure] || "#666666";
}
