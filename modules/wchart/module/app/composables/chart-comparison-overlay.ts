import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import type { ComparisonOptions, ComparisonResult } from './useChartComparison';
import { getComparisonColor, calculateCorrelation, calculateComparisonStatistics } from './chart-comparison-utils';

/**
 * Create overlay comparison (multiple series on same chart)
 */
export function createOverlayComparison(
	chartData: ChartData[],
	options: ComparisonOptions,
): ComparisonResult {
	const combinedSeries: ChartSeries[] = [];
	const correlations: Record<string, number> = {};

	chartData.forEach((chart, chartIndex) => {
		chart.series.forEach((series: ChartSeries, seriesIndex: number) => {
			const seriesName = chart.title
				? `${chart.title} - ${series.name}`
				: `Chart ${chartIndex + 1} - ${series.name}`;

			let processedData = [...series.data];

			// Normalize if requested
			if (options.normalize && processedData.length > 0) {
				const values = processedData.map((p: DataPoint) =>
					typeof p.y === "number" ? p.y : 0,
				);
				const max = Math.max(...values);
				const min = Math.min(...values);
				const range = max - min || 1;

				processedData = processedData.map((p: DataPoint) => ({
					...p,
					y: typeof p.y === "number" ? (p.y - min) / range : p.y,
				}));
			}

			combinedSeries.push({
				...series,
				name: seriesName,
				data: processedData,
				color: getComparisonColor(chartIndex, seriesIndex),
			});
		});
	});

	// Calculate correlations if requested
	if (options.showCorrelation && chartData.length >= 2) {
		const baselineSeries = chartData[options.baselineIndex || 0].series[0];
		chartData.forEach((chart, index) => {
			if (index !== (options.baselineIndex || 0)) {
				chart.series.forEach((series: ChartSeries) => {
					const correlation = calculateCorrelation(
						baselineSeries.data,
						series.data,
						options.correlationMethod || "pearson",
					);
					correlations[`${baselineSeries.name} vs ${series.name}`] =
						correlation;
				});
			}
		});
	}

	return {
		combinedData: {
			title: "Chart Comparison",
			series: combinedSeries,
		},
		differences: null,
		correlations: options.showCorrelation ? correlations : null,
		statistics: calculateComparisonStatistics(combinedSeries, correlations),
	};
}
