import type { ChartData } from '@/module/app/types/chart-basic';
import type { ComparisonOptions, ComparisonResult } from './useChartComparison';

/**
 * Create side-by-side comparison
 */
export function createSideBySideComparison(
	chartData: ChartData[],
	options: ComparisonOptions,
): ComparisonResult {
	// For side-by-side, we return the charts as-is but with synchronized scales if requested
	return {
		combinedData: {
			title: "Side-by-Side Comparison",
			series: chartData.flatMap((chart) => chart.series),
		},
		differences: null,
		correlations: null,
		statistics: {
			maxDifference: 0,
			avgDifference: 0,
			correlationStrength: "weak",
		},
	};
}
