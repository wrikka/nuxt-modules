import { computed, ref, readonly } from "vue";
import type { DataPoint, ChartData, ChartSeries } from '@/module/app/types/chart-basic';
import type {
	InsightType,
	InsightPriority,
	AIInsight,
	InsightOptions,
} from "../types/ai-insights";
import {
	calculateSkewness,
	calculateKurtosis,
	calculateCorrelation,
} from "../utils/ai-insights-utils";
import {
	analyzeTrend,
	detectAnomalies,
	analyzeDistribution,
	detectSeasonalPatterns,
	analyzeCrossSeries,
	analyzeChart,
} from "../utils/ai-insights-analysis";

/**
 * Composable for AI-powered chart insights
 */
export function useChartAIInsights(
	chartData: ChartData,
	options: InsightOptions = {},
) {
	const {
		enableTrendAnalysis = true,
		enableAnomalyDetection = true,
		enableCorrelationDiscovery = true,
		enableForecasting = true,
		enableSeasonalAnalysis = true,
		enableDistributionAnalysis = true,
		minConfidence = 0.6,
		maxInsights = 10,
	} = options;

	const insights = ref<AIInsight[]>([]);
	const isAnalyzing = ref(false);

	/**
	 * Generate AI insights
	 */
	const generateInsights = async (): Promise<AIInsight[]> => {
		isAnalyzing.value = true;

		try {
			const allInsights: AIInsight[] = [];

			// Analyze each series
			chartData.series.forEach((series, seriesIndex) => {
				const seriesInsights = analyzeSeries(series, seriesIndex);
				allInsights.push(...seriesInsights);
			});

			// Cross-series analysis
			if (chartData.series.length > 1) {
				const crossInsights = analyzeCrossSeries(
					chartData.series,
					enableCorrelationDiscovery,
				);
				allInsights.push(...crossInsights);
			}

			// Overall chart analysis
			const chartInsights = analyzeChart(chartData);
			allInsights.push(...chartInsights);

			// Filter by confidence and limit
			const filteredInsights = allInsights
				.filter((insight) => insight.confidence >= minConfidence)
				.sort((a, b) => {
					// Sort by priority first, then confidence
					const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
					const priorityDiff =
						priorityOrder[b.priority] - priorityOrder[a.priority];
					return priorityDiff !== 0
						? priorityDiff
						: b.confidence - a.confidence;
				})
				.slice(0, maxInsights);

			insights.value = filteredInsights;
			return filteredInsights;
		} finally {
			isAnalyzing.value = false;
		}
	};

	/**
	 * Analyze individual series
	 */
	const analyzeSeries = (
		series: ChartSeries,
		seriesIndex: number,
	): AIInsight[] => {
		const insights: AIInsight[] = [];
		const values = series.data
			.map((p: DataPoint) => Number(p.y))
			.filter((v: number) => !isNaN(v));

		if (values.length < 3) return insights;

		// Trend analysis
		if (enableTrendAnalysis) {
			const trendInsight = analyzeTrend(series, values);
			if (trendInsight) insights.push(trendInsight);
		}

		// Anomaly detection
		if (enableAnomalyDetection) {
			const anomalyInsights = detectAnomalies(series, values, seriesIndex);
			insights.push(...anomalyInsights);
		}

		// Distribution analysis
		if (enableDistributionAnalysis) {
			const distributionInsight = analyzeDistribution(series, values);
			if (distributionInsight) insights.push(distributionInsight);
		}

		// Seasonal patterns
		if (enableSeasonalAnalysis && values.length >= 12) {
			const seasonalInsight = detectSeasonalPatterns(series, values);
			if (seasonalInsight) insights.push(seasonalInsight);
		}

		return insights;
	};

	const getInsightsByCategory = (category: string) =>
		insights.value.filter((i: AIInsight) => i.category === category);
	const getInsightsByPriority = (priority: InsightPriority) =>
		insights.value.filter((i: AIInsight) => i.priority === priority);
	const exportInsights = () => insights.value;
	const clearInsights = () => {
		insights.value.length = 0;
	};

	return {
		insights: readonly(insights),
		isAnalyzing: readonly(isAnalyzing),
		generateInsights,
		getInsightsByCategory,
		getInsightsByPriority,
		exportInsights,
		clearInsights,
	};
}
