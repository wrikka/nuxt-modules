import type { DataPoint } from './chart';

/**
 * Statistical measure
 */
export type StatisticalMeasure =
	| "mean"
	| "median"
	| "mode"
	| "standard-deviation"
	| "variance"
	| "min"
	| "max"
	| "range"
	| "quartiles"
	| "percentiles"
	| "skewness"
	| "kurtosis"
	| "correlation"
	| "covariance";

/**
 * Statistical summary
 */
export interface StatisticalSummary {
	count: number;
	mean: number;
	median: number;
	mode: number[];
	standardDeviation: number;
	variance: number;
	min: number;
	max: number;
	range: number;
	quartiles: {
		q1: number;
		q2: number;
		q3: number;
	};
	percentiles: {
		p10: number;
		p25: number;
		p75: number;
		p90: number;
	};
	skewness: number;
	kurtosis: number;
	outliers: DataPoint[];
	distribution:
		| "normal"
		| "skewed-left"
		| "skewed-right"
		| "uniform"
		| "unknown";
}

/**
 * Correlation result
 */
export interface CorrelationResult {
	coefficient: number;
	pValue?: number;
	strength: "very-weak" | "weak" | "moderate" | "strong" | "very-strong";
	direction: "positive" | "negative" | "none";
}

/**
 * Outlier detection method
 */
export type OutlierMethod = "iqr" | "z-score" | "modified-z-score";
