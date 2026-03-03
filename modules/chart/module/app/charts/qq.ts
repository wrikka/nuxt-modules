import type { QQData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Q-Q plot utilities - quantile-quantile comparison
 */

/**
 * Generate Q-Q plot data
 */
export function generateQQData(
	observed: number[],
	expected?: number[],
	options: {
		title?: string;
		distribution?: "normal" | "uniform" | "exponential" | "custom";
		parameters?: { mean?: number; std?: number; lambda?: number };
		showReferenceLine?: boolean;
		showConfidenceBands?: boolean;
		confidenceLevel?: number;
		pointSize?: number;
	} = {},
): QQData {
	const {
		title,
		distribution = "normal",
		parameters = {},
		showReferenceLine = true,
		showConfidenceBands = false,
		confidenceLevel = 0.95,
		pointSize = 6,
	} = options;

	// Sort observed data
	const sortedObserved = [...observed].sort((a, b) => a - b);
	const n = sortedObserved.length;

	// Generate expected quantiles based on distribution
	let expectedQuantiles: number[];

	if (expected && expected.length === n) {
		expectedQuantiles = [...expected].sort((a, b) => a - b);
	} else {
		expectedQuantiles = generateExpectedQuantiles(distribution, n, parameters);
	}

	return {
		title: title || `Q-Q Plot (${distribution} distribution)`,
		observed: sortedObserved,
		expected: expectedQuantiles,
		distribution,
	};
}

/**
 * Generate expected quantiles for different distributions
 */
function generateExpectedQuantiles(
	distribution: "normal" | "uniform" | "exponential" | "custom",
	n: number,
	parameters: { mean?: number; std?: number; lambda?: number } = {},
): number[] {
	const { mean = 0, std = 1, lambda = 1 } = parameters;

	const quantiles: number[] = [];

	for (let i = 1; i <= n; i++) {
		// Calculate probability points (i - 0.5) / n for better estimation
		const p = (i - 0.5) / n;

		let quantile: number;

		switch (distribution) {
			case "normal":
				quantile = mean + std * inverseNormalCDF(p);
				break;
			case "uniform":
				// Assuming range from mean - std to mean + std
				const min = mean - std * Math.sqrt(3); // for uniform distribution
				const max = mean + std * Math.sqrt(3);
				quantile = min + p * (max - min);
				break;
			case "exponential":
				quantile = -Math.log(1 - p) / lambda;
				break;
			default:
				// Fallback to normal
				quantile = mean + std * inverseNormalCDF(p);
		}

		quantiles.push(quantile);
	}

	return quantiles;
}

/**
 * Generate Q-Q plot from two samples for comparison
 */
export function generateQQComparisonData(
	sample1: number[],
	sample2: number[],
	labels: [string, string] = ["Sample 1", "Sample 2"],
	options: {
		title?: string;
		showReferenceLine?: boolean;
	} = {},
): {
	title?: string;
	observed: number[];
	expected: number[];
	labels: [string, string];
} {
	const { title, showReferenceLine = true } = options;

	// Sort both samples
	const sorted1 = [...sample1].sort((a, b) => a - b);
	const sorted2 = [...sample2].sort((a, b) => a - b);

	// Use the smaller sample size
	const n = Math.min(sorted1.length, sorted2.length);
	const observed = sorted1.slice(0, n);
	const expected = sorted2.slice(0, n);

	return {
		title: title || `${labels[0]} vs ${labels[1]} Q-Q Plot`,
		observed,
		expected,
		labels,
	};
}

/**
 * Calculate Q-Q plot statistics
 */
export function calculateQQStatistics(
	observed: number[],
	expected: number[],
): {
	n: number;
	slope: number;
	intercept: number;
	rSquared: number;
	ksStatistic: number;
	ksPValue: number;
	shapiroWilk?: number;
} {
	const n = Math.min(observed.length, expected.length);
	const obs = observed.slice(0, n);
	const exp = expected.slice(0, n);

	// Linear regression to find slope and intercept
	let sumX = 0,
		sumY = 0,
		sumXY = 0,
		sumXX = 0;

	for (let i = 0; i < n; i++) {
		sumX += exp[i];
		sumY += obs[i];
		sumXY += exp[i] * obs[i];
		sumXX += exp[i] * exp[i];
	}

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	// Calculate R-squared
	let ssRes = 0,
		ssTot = 0;
	const meanY = sumY / n;

	for (let i = 0; i < n; i++) {
		const predicted = slope * exp[i] + intercept;
		ssRes += Math.pow(obs[i] - predicted, 2);
		ssTot += Math.pow(obs[i] - meanY, 2);
	}

	const rSquared = 1 - ssRes / ssTot;

	// Kolmogorov-Smirnov test (simplified)
	const differences = obs.map((val, i) => Math.abs(val - exp[i]));
	const ksStatistic = Math.max(...differences);

	// Simplified p-value approximation
	const ksPValue = Math.exp(-2 * n * ksStatistic * ksStatistic);

	return {
		n,
		slope,
		intercept,
		rSquared,
		ksStatistic,
		ksPValue,
	};
}

/**
 * Test for normality using Q-Q plot
 */
export function testNormalityWithQQ(data: number[]): {
	isNormal: boolean;
	confidence: number;
	reason: string;
	statistics: {
		shapiroWilk: number;
		andersonDarling: number;
		kolmogorovSmirnov: number;
	};
} {
	const n = data.length;
	const sortedData = [...data].sort((a, b) => a - b);

	// Generate expected normal quantiles
	const mean = sortedData.reduce((sum, val) => sum + val, 0) / n;
	const variance =
		sortedData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
	const std = Math.sqrt(variance);

	const expected = sortedData.map((_, i) => {
		const p = (i + 0.5) / n;
		return mean + std * inverseNormalCDF(p);
	});

	// Calculate statistics
	const stats = calculateQQStatistics(sortedData, expected);

	// Simplified normality tests
	const shapiroWilk = calculateShapiroWilk(sortedData);
	const andersonDarling = calculateAndersonDarling(sortedData, mean, std);
	const kolmogorovSmirnov = stats.ksStatistic;

	// Determine normality
	let isNormal = false;
	let confidence = 0;
	let reason = "";

	if (stats.rSquared > 0.95 && stats.ksPValue > 0.05) {
		isNormal = true;
		confidence = 0.9;
		reason =
			"Data appears normally distributed based on Q-Q plot linearity and KS test";
	} else if (stats.rSquared > 0.9) {
		isNormal = false;
		confidence = 0.7;
		reason = "Data may be normally distributed but shows some deviation";
	} else {
		isNormal = false;
		confidence = 0.9;
		reason = "Data does not appear normally distributed";
	}

	return {
		isNormal,
		confidence,
		reason,
		statistics: {
			shapiroWilk,
			andersonDarling,
			kolmogorovSmirnov,
		},
	};
}

/**
 * Simplified inverse normal CDF (approximation)
 */
function inverseNormalCDF(p: number): number {
	if (p <= 0 || p >= 1) return 0;

	// Approximation using inverse error function
	const a1 = -3.969683028665376e1;
	const a2 = 2.209460984245205e2;
	const a3 = -2.759285104469687e2;
	const a4 = 1.38357751867269e2;
	const a5 = -3.066479806614716e1;
	const a6 = 2.506628277459239;

	const b1 = -5.447609879822406e1;
	const b2 = 1.615858368580409e2;
	const b3 = -1.556989798598866e2;
	const b4 = 6.680131188771972e1;
	const b5 = -1.328068155288572e1;

	const c1 = -7.784894002430293e-3;
	const c2 = -3.223964580411365e-1;
	const c3 = -2.400758277161838;
	const c4 = -2.549732539343734;
	const c5 = 4.374664141464968;
	const c6 = 2.938163982698783;

	const d1 = 7.784695709041462e-3;
	const d2 = 3.224671290700398e-1;
	const d3 = 2.445134137142996;
	const d4 = 3.754408661907416;

	let q: number;
	let r: number;

	if (p < 0.02425) {
		q = Math.sqrt(-2 * Math.log(p));
		r =
			(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
			((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
	} else if (p > 0.97575) {
		q = Math.sqrt(-2 * Math.log(1 - p));
		r =
			-(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
			((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
	} else {
		q = p - 0.5;
		r = q * q;
		r =
			((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
			(((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
	}

	return r;
}

/**
 * Simplified Shapiro-Wilk test
 */
function calculateShapiroWilk(data: number[]): number {
	// Simplified approximation - in practice, use a proper statistical library
	const n = data.length;
	const sorted = [...data].sort((a, b) => a - b);

	let sum = 0;
	for (let i = 0; i < n; i++) {
		sum += (i + 1) * sorted[i];
	}

	// This is a very simplified approximation
	return Math.min(1, Math.abs(sum / ((n * (n + 1)) / 2)));
}

/**
 * Simplified Anderson-Darling test
 */
function calculateAndersonDarling(
	data: number[],
	mean: number,
	std: number,
): number {
	const n = data.length;
	const sorted = [...data].sort((a, b) => a - b);

	let sum = 0;
	for (let i = 0; i < n; i++) {
		const z = (sorted[i] - mean) / std;
		const cdf = 0.5 * (1 + Math.erf(z / Math.sqrt(2)));
		const term1 = (2 * (i + 1) - 1) * Math.log(cdf);
		const term2 = (2 * (n - i) - 1) * Math.log(1 - cdf);
		sum += term1 + term2;
	}

	const A2 = -n - sum / n;
	return A2;
}


