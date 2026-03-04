import { ref, computed } from "vue";
import type { DataPoint, ChartData, ChartSeries } from '@/module/app/types/chart-basic';
import type {
	PredictionMethod,
	PredictionConfig,
	PredictionResult,
	TrendAnalysis,
} from "../types/predictive-analytics";
import {
	linearRegressionPrediction,
	polynomialRegressionPrediction,
	exponentialSmoothingPrediction,
	movingAveragePrediction,
	arimaPrediction,
	neuralNetworkPrediction,
	calculateConfidenceIntervals,
	analyzeTrend,
} from "../utils/predictive-analytics-utils";

/**
 * Composable for predictive analytics
 */
export function useChartPredictiveAnalytics(
	data: DataPoint[],
	options: {
		defaultMethod?: PredictionMethod;
		enableCaching?: boolean;
	} = {},
) {
	const { defaultMethod = "linear-regression", enableCaching = true } = options;

	const predictionCache = ref<Map<string, PredictionResult>>(new Map());

	/**
	 * Generate predictions
	 */
	const generatePrediction = (
		points: DataPoint[],
		config: PredictionConfig,
	): PredictionResult => {
		const cacheKey = `${config.method}-${config.periods}-${config.confidenceLevel}-${points.length}`;

		if (enableCaching && predictionCache.value.has(cacheKey)) {
			return predictionCache.value.get(cacheKey)!;
		}

		let result: PredictionResult;

		switch (config.method) {
			case "linear-regression":
				result = linearRegressionPrediction(points, config);
				break;
			case "polynomial-regression":
				result = polynomialRegressionPrediction(points, config);
				break;
			case "exponential-smoothing":
				result = exponentialSmoothingPrediction(points, config);
				break;
			case "moving-average":
				result = movingAveragePrediction(points, config);
				break;
			case "arima":
				result = arimaPrediction(points, config);
				break;
			case "neural-network":
				result = neuralNetworkPrediction(points, config);
				break;
			default:
				result = linearRegressionPrediction(points, config);
		}

		if (enableCaching) {
			predictionCache.value.set(cacheKey, result);
		}

		return result;
	};

	/**
	 * Create prediction overlay for chart
	 */
	const createPredictionOverlay = (
		originalData: ChartData,
		prediction: PredictionResult,
		config: PredictionConfig,
	): ChartData => {
		const predictionSeries: ChartSeries = {
			name: `Prediction (${config.method})`,
			data: prediction.predictedPoints,
			type: "line",
			color: "#ff6b6b",
		};

		const upperBoundSeries: ChartSeries = {
			name: "Upper Confidence",
			data: prediction.confidenceInterval.upper,
			type: "line",
			color: "#cccccc",
		};

		const lowerBoundSeries: ChartSeries = {
			name: "Lower Confidence",
			data: prediction.confidenceInterval.lower,
			type: "line",
			color: "#cccccc",
		};

		return {
			...originalData,
			series: [
				...originalData.series,
				predictionSeries,
				upperBoundSeries,
				lowerBoundSeries,
			].filter((series) => series.data.length > 0),
		};
	};

	/**
	 * Clear prediction cache
	 */
	const clearCache = () => {
		predictionCache.value.clear();
	};

	return {
		generatePrediction,
		analyzeTrend,
		createPredictionOverlay,
		clearCache,
	};
}
