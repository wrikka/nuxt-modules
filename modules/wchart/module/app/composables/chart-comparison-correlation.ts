import type { ChartData } from '@/module/app/types/chart-basic';
import type { ComparisonOptions, ComparisonResult } from './useChartComparison';
import { calculateCorrelation, calculateComparisonStatistics } from './chart-comparison-utils';
import { createOverlayComparison } from './chart-comparison-overlay';

/**
 * Create correlation comparison
 */
export function createCorrelationComparison(
	chartData: ChartData[],
	options: ComparisonOptions,
): ComparisonResult {
	const correlations: Record<string, number> = {};

	// Calculate correlations between all pairs
	for (let i = 0; i < chartData.length; i++) {
		for (let j = i + 1; j < chartData.length; j++) {
			const series1 = chartData[i].series[0];
			const series2 = chartData[j].series[0];

			if (series1 && series2) {
				const correlation = calculateCorrelation(
					series1.data,
					series2.data,
					options.correlationMethod || "pearson",
				);
				correlations[`${series1.name} vs ${series2.name}`] = correlation;
			}
		}
	}

	return {
		combinedData: createOverlayComparison(chartData, options).combinedData,
		differences: null,
		correlations,
		statistics: calculateComparisonStatistics([], correlations),
	};
}
