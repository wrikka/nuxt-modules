import type { DataPoint, ChartData, ChartSeries } from '../types/chart-basic';
import type { AIInsight } from "../types/ai-insights";
import {
	calculateSkewness,
	calculateKurtosis,
	calculateCorrelation,
} from './ai-insights-utils';

/**
 * Analyze trend in a series
 */
export function analyzeTrend(
	series: ChartSeries,
	values: number[],
): AIInsight | null {
	const n = values.length;
	if (n < 3) return null;

	// Simple linear regression
	const xValues = Array.from({ length: n }, (_, i) => i);
	const sumX = xValues.reduce((a, b) => a + b, 0);
	const sumY = values.reduce((a, b) => a + b, 0);
	const sumXY = xValues.reduce((a, b, i) => a + b * values[i], 0);
	const sumXX = xValues.reduce((a, b) => a + b * b, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	// R-squared
	const yMean = sumY / n;
	const ssRes = xValues.reduce((sum, _, i) => {
		const predicted = slope * i + intercept;
		return sum + Math.pow(values[i] - predicted, 2);
	}, 0);
	const ssTot = values.reduce(
		(sum, value) => sum + Math.pow(value - yMean, 2),
		0,
	);
	const rSquared = 1 - ssRes / ssTot;

	if (rSquared < 0.3) return null; // Not a strong trend

	const trend =
		slope > 0.01 ? "increasing" : slope < -0.01 ? "decreasing" : "stable";
	const strength =
		rSquared > 0.8 ? "strong" : rSquared > 0.5 ? "moderate" : "weak";

	return {
		id: `trend-${series.name}-${Date.now()}`,
		type: "trend-analysis",
		title: `${strength.charAt(0).toUpperCase() + strength.slice(1)} ${trend} trend detected`,
		description: `The data shows a ${strength} ${trend} trend with ${slope > 0 ? "+" : ""}${(slope * 100).toFixed(1)}% change per period.`,
		priority: rSquared > 0.8 ? "high" : "medium",
		confidence: rSquared,
		data: { slope, intercept, rSquared },
		recommendations: [
			trend === "increasing"
				? "Consider capacity planning for continued growth"
				: "Investigate causes of declining trend",
			"Monitor this trend closely in future periods",
			"Consider forecasting based on this trend",
		],
		timestamp: new Date(),
		category: "data",
	};
}

/**
 * Detect anomalies in a series
 */
export function detectAnomalies(
	series: ChartSeries,
	values: number[],
	_seriesIndex: number,
): AIInsight[] {
	const insights: AIInsight[] = [];

	if (values.length < 5) return insights;

	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
		values.length,
	);

	values.forEach((value, index) => {
		const zScore = Math.abs((value - mean) / std);
		if (zScore > 3) {
			insights.push({
				id: `anomaly-${series.name}-${index}-${Date.now()}`,
				type: "anomaly-detection",
				title: "Significant outlier detected",
				description: `Data point ${index + 1} in ${series.name} deviates significantly from the norm (${value} vs expected ${mean.toFixed(2)}).`,
				priority: zScore > 4 ? "critical" : "high",
				confidence: Math.min(zScore / 5, 1),
				data: { value, index, zScore, mean, std },
				recommendations: [
					"Verify data accuracy for this point",
					"Consider removing or correcting this outlier",
					"Investigate potential causes for this anomaly",
				],
				timestamp: new Date(),
				category: "data",
			});
		}
	});

	return insights;
}

/**
 * Analyze distribution of a series
 */
export function analyzeDistribution(
	series: ChartSeries,
	values: number[],
): AIInsight | null {
	if (values.length < 5) return null;

	const sorted = [...values].sort((a, b) => a - b);
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	const median = sorted[Math.floor(sorted.length / 2)];
	const skewness = calculateSkewness(values, mean);
	const kurtosis = calculateKurtosis(values, mean);

	let distributionType = "normal";
	if (Math.abs(skewness) > 0.5) {
		distributionType = skewness > 0 ? "right-skewed" : "left-skewed";
	}

	const insightNeeded = Math.abs(skewness) > 0.5 || Math.abs(kurtosis) > 0.5;

	if (!insightNeeded) return null;

	return {
		id: `distribution-${series.name}-${Date.now()}`,
		type: "distribution-analysis",
		title: `Non-normal distribution detected`,
		description: `The data distribution appears ${distributionType} (skewness: ${skewness.toFixed(2)}, kurtosis: ${kurtosis.toFixed(2)}).`,
		priority: "medium",
		confidence: Math.min(Math.abs(skewness) + Math.abs(kurtosis), 1),
		data: { skewness, kurtosis, mean, median },
		recommendations: [
			"Consider data transformation for analysis",
			"Use appropriate statistical tests for non-normal data",
			"Visualize distribution with histogram or Q-Q plot",
		],
		timestamp: new Date(),
		category: "data",
	};
}

/**
 * Detect seasonal patterns in a series
 */
export function detectSeasonalPatterns(
	series: ChartSeries,
	values: number[],
): AIInsight | null {
	if (values.length < 12) return null;

	// Simple autocorrelation check
	const correlations: number[] = [];
	for (let lag = 1; lag <= Math.min(12, Math.floor(values.length / 2)); lag++) {
		const corr = calculateCorrelation(values.slice(0, -lag), values.slice(lag));
		correlations.push(corr);
	}

	const maxCorr = Math.max(...correlations);
	const bestLag = correlations.indexOf(maxCorr) + 1;

	if (maxCorr < 0.3) return null; // No significant seasonality

	return {
		id: `seasonal-${series.name}-${Date.now()}`,
		type: "seasonal-patterns",
		title: "Seasonal pattern detected",
		description: `Strong seasonal pattern with period of ${bestLag} units (correlation: ${(maxCorr * 100).toFixed(1)}%).`,
		priority: maxCorr > 0.7 ? "high" : "medium",
		confidence: maxCorr,
		data: { period: bestLag, correlation: maxCorr, correlations },
		recommendations: [
			"Consider seasonal decomposition for forecasting",
			"Use seasonal ARIMA models for predictions",
			"Account for seasonal effects in analysis",
		],
		timestamp: new Date(),
		category: "data",
	};
}

/**
 * Analyze cross-series relationships
 */
export function analyzeCrossSeries(
	series: ChartSeries[],
	enableCorrelationDiscovery: boolean,
): AIInsight[] {
	const insights: AIInsight[] = [];

	if (!enableCorrelationDiscovery || series.length < 2) return insights;

	for (let i = 0; i < series.length; i++) {
		for (let j = i + 1; j < series.length; j++) {
			const series1 = series[i];
			const series2 = series[j];

			const values1 = series1.data
				.map((p: DataPoint) => Number(p.y))
				.filter((v: number) => !isNaN(v));
			const values2 = series2.data
				.map((p: DataPoint) => Number(p.y))
				.filter((v: number) => !isNaN(v));

			if (values1.length !== values2.length || values1.length < 3) continue;

			const correlation = calculateCorrelation(values1, values2);

			if (Math.abs(correlation) > 0.5) {
				const strength = Math.abs(correlation) > 0.8 ? "strong" : "moderate";
				const direction = correlation > 0 ? "positive" : "negative";

				insights.push({
					id: `correlation-${series1.name}-${series2.name}-${Date.now()}`,
					type: "correlation-discovery",
					title: `${strength} correlation detected`,
					description: `${series1.name} and ${series2.name} show ${direction} correlation (r = ${correlation.toFixed(3)}).`,
					priority: Math.abs(correlation) > 0.8 ? "high" : "medium",
					confidence: Math.abs(correlation),
					data: { correlation, series1: series1.name, series2: series2.name },
					recommendations: [
						"Consider combined analysis of these metrics",
						correlation > 0.8
							? "These metrics move together - watch for co-movements"
							: "Investigate relationship between these variables",
					],
					timestamp: new Date(),
					category: "data",
				});
			}
		}
	}

	return insights;
}

/**
 * Analyze overall chart
 */
export function analyzeChart(chartData: ChartData): AIInsight[] {
	const insights: AIInsight[] = [];

	// Data quality checks
	const totalPoints = chartData.series.reduce(
		(sum, series) => sum + series.data.length,
		0,
	);
	const nullPoints = chartData.series.reduce(
		(sum, series) =>
			sum + series.data.filter((p) => p.y == null || isNaN(Number(p.y))).length,
		0,
	);

	if (nullPoints > 0) {
		const nullPercentage = (nullPoints / totalPoints) * 100;
		insights.push({
			id: `data-quality-${Date.now()}`,
			type: "data-quality-issue",
			title: "Data quality issues detected",
			description: `${nullPercentage.toFixed(1)}% of data points are missing or invalid.`,
			priority:
				nullPercentage > 20
					? "critical"
					: nullPercentage > 10
						? "high"
						: "medium",
			confidence: Math.min(nullPercentage / 100, 1),
			data: { nullPoints, totalPoints, nullPercentage },
			recommendations: [
				"Clean and validate data before visualization",
				"Consider imputation methods for missing values",
				"Review data collection process",
			],
			timestamp: new Date(),
			category: "data",
		});
	}

	// Visualization suggestions
	if (chartData.series.length > 5) {
		insights.push({
			id: `viz-suggestion-${Date.now()}`,
			type: "visualization-suggestion",
			title: "Consider chart optimization",
			description: `Chart has ${chartData.series.length} series which may be cluttered.`,
			priority: "low",
			confidence: 0.8,
			data: { seriesCount: chartData.series.length },
			recommendations: [
				"Consider grouping series or using faceted charts",
				"Use interactive legend to toggle series visibility",
				"Consider small multiples for better comparison",
			],
			timestamp: new Date(),
			category: "visualization",
		});
	}

	return insights;
}
