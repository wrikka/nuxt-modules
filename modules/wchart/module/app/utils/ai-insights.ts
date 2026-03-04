import type { DataPoint } from '@/module/app/types/chart-basic';

type InsightPriority = "critical" | "high" | "medium" | "low";

type InsightType =
	| "trend"
	| "anomaly"
	| "correlation"
	| "pattern"
	| "outlier"
	| "prediction";

interface AIInsight {
	id: string;
	type: InsightType;
	title: string;
	description: string;
	priority: InsightPriority;
	confidence: number;
	data?: any;
	recommendations: string[];
	timestamp: Date;
	category: string;
}

/**
 * Calculate correlation coefficient between two data series
 */
export function calculateCorrelation(
	values1: number[],
	values2: number[],
): number {
	const n = values1.length;
	if (n !== values2.length || n < 2) return 0;

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
 * Calculate skewness of a data series
 */
export function calculateSkewness(values: number[], mean: number): number {
	const n = values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n,
	);
	if (std === 0) return 0;
	return (
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 3), 0) /
		n
	);
}

/**
 * Calculate kurtosis of a data series
 */
export function calculateKurtosis(values: number[], mean: number): number {
	const n = values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n,
	);
	if (std === 0) return 0;
	return (
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 4), 0) /
			n -
		3
	);
}

/**
 * Detect anomalies using statistical methods
 */
export function detectStatisticalAnomalies(
	values: number[],
	threshold: number = 2,
): number[] {
	if (values.length < 3) return [];

	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
			values.length,
	);

	return values
		.map((value, index) => ({ value, index }))
		.filter(({ value }) => Math.abs((value - mean) / std) > threshold)
		.map(({ index }) => index);
}

/**
 * Analyze trend in data series
 */
export function analyzeTrend(points: DataPoint[]): {
	slope: number;
	intercept: number;
	rSquared: number;
	trend: "increasing" | "decreasing" | "stable";
} {
	const n = points.length;
	if (n < 2) return { slope: 0, intercept: 0, rSquared: 0, trend: "stable" };

	const data = points.map((point, index) => ({
		x: index,
		y: Number(point.y) || 0,
	}));

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

	return { slope, intercept, rSquared, trend };
}

/**
 * Classify distribution type
 */
export function classifyDistribution(
	skewness: number,
	kurtosis: number,
): string {
	const absSkew = Math.abs(skewness);
	if (absSkew < 0.5 && Math.abs(kurtosis) < 0.5) return "normal";
	if (skewness > 0.5) return "right-skewed";
	if (skewness < -0.5) return "left-skewed";
	return "unknown";
}

/**
 * Create insight with standard structure
 */
export function createInsight(
	type: InsightType,
	title: string,
	description: string,
	priority: InsightPriority,
	confidence: number,
	data: any,
	recommendations: string[],
	category: AIInsight["category"],
): AIInsight {
	return {
		id: `insight_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		type,
		title,
		description,
		priority,
		confidence: Math.max(0, Math.min(1, confidence)),
		data,
		recommendations,
		timestamp: new Date(),
		category,
	};
}

/**
 * Get insight priority level based on confidence and impact
 */
export function calculateInsightPriority(
	confidence: number,
	impact: "low" | "medium" | "high" | "critical",
): InsightPriority {
	if (impact === "critical" || (confidence > 0.9 && impact === "high"))
		return "critical";
	if (impact === "high" || (confidence > 0.8 && impact === "medium"))
		return "high";
	if (impact === "medium" || confidence > 0.6) return "medium";
	return "low";
}

/**
 * Filter insights by confidence threshold
 */
export function filterInsightsByConfidence(
	insights: AIInsight[],
	minConfidence: number,
): AIInsight[] {
	return insights.filter((insight) => insight.confidence >= minConfidence);
}

/**
 * Sort insights by priority and confidence
 */
export function sortInsights(insights: AIInsight[]): AIInsight[] {
	const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

	return insights.sort((a, b) => {
		const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
		return priorityDiff !== 0 ? priorityDiff : b.confidence - a.confidence;
	});
}
