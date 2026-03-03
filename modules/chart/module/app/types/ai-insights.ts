/**
 * AI Insight type
 */
export type InsightType =
	| "trend-analysis"
	| "anomaly-detection"
	| "correlation-discovery"
	| "forecast-accuracy"
	| "seasonal-patterns"
	| "distribution-analysis"
	| "outlier-alert"
	| "performance-recommendation"
	| "data-quality-issue"
	| "visualization-suggestion";

/**
 * Insight priority
 */
export type InsightPriority = "low" | "medium" | "high" | "critical";

/**
 * AI Insight
 */
export interface AIInsight {
	id: string;
	type: InsightType;
	title: string;
	description: string;
	priority: InsightPriority;
	confidence: number; // 0-1
	data: any; // Additional insight data
	recommendations: string[];
	timestamp: Date;
	category: "data" | "visualization" | "performance" | "business";
}

/**
 * Insight generation options
 */
export interface InsightOptions {
	enableTrendAnalysis?: boolean;
	enableAnomalyDetection?: boolean;
	enableCorrelationDiscovery?: boolean;
	enableForecasting?: boolean;
	enableSeasonalAnalysis?: boolean;
	enableDistributionAnalysis?: boolean;
	minConfidence?: number;
	maxInsights?: number;
}
