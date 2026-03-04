import type { DataPoint } from './chart';

/**
 * Prediction method
 */
export type PredictionMethod =
	| "linear-regression"
	| "polynomial-regression"
	| "exponential-smoothing"
	| "moving-average"
	| "arima"
	| "neural-network";

/**
 * Confidence level
 */
export type ConfidenceLevel = 0.8 | 0.9 | 0.95 | 0.99;

/**
 * Prediction configuration
 */
export interface PredictionConfig {
	method: PredictionMethod;
	periods: number; // Number of future periods to predict
	confidenceLevel: ConfidenceLevel;
	degree?: number; // For polynomial regression
	smoothingFactor?: number; // For exponential smoothing
	windowSize?: number; // For moving average
}

/**
 * Prediction result
 */
export interface PredictionResult {
	predictedPoints: DataPoint[];
	confidenceInterval: {
		upper: DataPoint[];
		lower: DataPoint[];
	};
	rSquared?: number;
	accuracy?: number;
	trend?: "increasing" | "decreasing" | "stable";
}

/**
 * Trend analysis result
 */
export interface TrendAnalysis {
	slope: number;
	intercept: number;
	rSquared: number;
	trend: "increasing" | "decreasing" | "stable";
	seasonality?: {
		period: number;
		strength: number;
	};
}
