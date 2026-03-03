import type { DataPoint } from '@/module/app/types/chart-basic';
import type {
	PredictionConfig,
	PredictionResult,
	TrendAnalysis,
	ConfidenceLevel,
} from "../types/predictive-analytics";

/**
 * Linear regression prediction
 */
export const linearRegressionPrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	const { periods, confidenceLevel } = config;

	if (points.length < 2) {
		return {
			predictedPoints: [],
			confidenceInterval: { upper: [], lower: [] },
		};
	}

	// Prepare data
	const data = points.map((point, index) => ({
		x: index,
		y: Number(point.y) || 0,
	}));

	// Calculate linear regression
	const n = data.length;
	const sumX = data.reduce((sum, point) => sum + point.x, 0);
	const sumY = data.reduce((sum, point) => sum + point.y, 0);
	const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
	const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	// Calculate R-squared
	const yMean = sumY / n;
	const ssRes = data.reduce((sum, point) => {
		const predicted = slope * point.x + intercept;
		return sum + Math.pow(point.y - predicted, 2);
	}, 0);
	const ssTot = data.reduce(
		(sum, point) => sum + Math.pow(point.y - yMean, 2),
		0,
	);
	const rSquared = 1 - ssRes / ssTot;

	// Generate predictions
	const predictedPoints: DataPoint[] = [];
	const lastIndex = data[data.length - 1].x;

	for (let i = 1; i <= periods; i++) {
		const x = lastIndex + i;
		const y = slope * x + intercept;
		predictedPoints.push({
			x: x,
			y: y,
			label: `Prediction ${i}`,
		});
	}

	// Calculate confidence intervals
	const confidenceIntervals = calculateConfidenceIntervals(
		data,
		slope,
		intercept,
		periods,
		confidenceLevel,
	);

	return {
		predictedPoints,
		confidenceInterval: confidenceIntervals,
		rSquared,
		trend:
			slope > 0.01 ? "increasing" : slope < -0.01 ? "decreasing" : "stable",
	};
};

/**
 * Polynomial regression prediction
 */
export const polynomialRegressionPrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	const degree = config.degree || 2;

	// Simplified polynomial regression (in practice, use a proper library)
	return linearRegressionPrediction(points, config);
};

/**
 * Exponential smoothing prediction
 */
export const exponentialSmoothingPrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	const alpha = config.smoothingFactor || 0.3;

	if (points.length === 0) {
		return {
			predictedPoints: [],
			confidenceInterval: { upper: [], lower: [] },
		};
	}

	const values = points.map((p) => Number(p.y) || 0);
	const smoothed = [values[0]];

	// Calculate smoothed values
	for (let i = 1; i < values.length; i++) {
		smoothed.push(alpha * values[i] + (1 - alpha) * smoothed[i - 1]);
	}

	// Generate predictions
	const predictedPoints: DataPoint[] = [];
	let lastSmoothed = smoothed[smoothed.length - 1];

	for (let i = 1; i <= config.periods; i++) {
		lastSmoothed = alpha * lastSmoothed + (1 - alpha) * lastSmoothed; // Simplified
		predictedPoints.push({
			x: points.length + i - 1,
			y: lastSmoothed,
			label: `Prediction ${i}`,
		});
	}

	return {
		predictedPoints,
		confidenceInterval: { upper: [], lower: [] }, // Simplified
	};
};

/**
 * Moving average prediction
 */
export const movingAveragePrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	const windowSize = config.windowSize || 3;

	if (points.length < windowSize) {
		return {
			predictedPoints: [],
			confidenceInterval: { upper: [], lower: [] },
		};
	}

	const values = points.map((p) => Number(p.y) || 0);
	const movingAvg =
		values.slice(-windowSize).reduce((a, b) => a + b, 0) / windowSize;

	// Generate predictions (simple - use last moving average)
	const predictedPoints: DataPoint[] = [];
	for (let i = 1; i <= config.periods; i++) {
		predictedPoints.push({
			x: points.length + i - 1,
			y: movingAvg,
			label: `Prediction ${i}`,
		});
	}

	return {
		predictedPoints,
		confidenceInterval: { upper: [], lower: [] },
	};
};

/**
 * ARIMA prediction (simplified)
 */
export const arimaPrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	// Simplified ARIMA implementation
	return linearRegressionPrediction(points, config);
};

/**
 * Neural network prediction (placeholder)
 */
export const neuralNetworkPrediction = (
	points: DataPoint[],
	config: PredictionConfig,
): PredictionResult => {
	// Placeholder for neural network prediction
	return linearRegressionPrediction(points, config);
};

/**
 * Calculate confidence intervals for linear regression
 */
export const calculateConfidenceIntervals = (
	data: { x: number; y: number }[],
	slope: number,
	intercept: number,
	periods: number,
	confidenceLevel: ConfidenceLevel,
): { upper: DataPoint[]; lower: DataPoint[] } => {
	const n = data.length;
	const alpha = 1 - confidenceLevel;
	const tValue = 2.306; // Approximate t-value for 95% confidence with n>30

	// Calculate standard error of estimate
	const yMean = data.reduce((sum, point) => sum + point.y, 0) / n;
	const se = Math.sqrt(
		data.reduce((sum, point) => {
			const predicted = slope * point.x + intercept;
			return sum + Math.pow(point.y - predicted, 2);
		}, 0) /
			(n - 2),
	);

	const upper: DataPoint[] = [];
	const lower: DataPoint[] = [];
	const lastIndex = data[data.length - 1].x;

	for (let i = 1; i <= periods; i++) {
		const x = lastIndex + i;
		const predicted = slope * x + intercept;

		// Standard error of prediction
		const xMean = data.reduce((sum, point) => sum + point.x, 0) / n;
		const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
		const sePrediction =
			se *
			Math.sqrt(
				1 + 1 / n + Math.pow(x - xMean, 2) / (sumXX - n * xMean * xMean),
			);

		const margin = tValue * sePrediction;

		upper.push({
			x: x,
			y: predicted + margin,
		});

		lower.push({
			x: x,
			y: predicted - margin,
		});
	}

	return { upper, lower };
};

/**
 * Analyze trend
 */
export const analyzeTrend = (points: DataPoint[]): TrendAnalysis => {
	if (points.length < 2) {
		return {
			slope: 0,
			intercept: 0,
			rSquared: 0,
			trend: "stable",
		};
	}

	const data = points.map((point, index) => ({
		x: index,
		y: Number(point.y) || 0,
	}));

	const n = data.length;
	const sumX = data.reduce((sum, point) => sum + point.x, 0);
	const sumY = data.reduce((sum, point) => sum + point.y, 0);
	const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
	const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	// Calculate R-squared
	const yMean = sumY / n;
	const ssRes = data.reduce((sum, point) => {
		const predicted = slope * point.x + intercept;
		return sum + Math.pow(point.y - predicted, 2);
	}, 0);
	const ssTot = data.reduce(
		(sum, point) => sum + Math.pow(point.y - yMean, 2),
		0,
	);
	const rSquared = 1 - ssRes / ssTot;

	const trend =
		slope > 0.01 ? "increasing" : slope < -0.01 ? "decreasing" : "stable";

	return {
		slope,
		intercept,
		rSquared,
		trend,
	};
};
