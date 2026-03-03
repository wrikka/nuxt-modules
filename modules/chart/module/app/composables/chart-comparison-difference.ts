import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import type { ComparisonOptions, ComparisonResult } from './useChartComparison';
import { getDifferenceColor, calculateComparisonStatistics } from './chart-comparison-utils';
import { createOverlayComparison } from './chart-comparison-overlay';

/**
 * Create difference comparison
 */
export function createDifferenceComparison(
	chartData: ChartData[],
	options: ComparisonOptions,
): ComparisonResult {
	const baselineIndex = options.baselineIndex || 0;
	const baselineChart = chartData[baselineIndex];

	if (!baselineChart) {
		return createOverlayComparison(chartData, options);
	}

	const differenceSeries: ChartSeries[] = [];

	chartData.forEach((chart, chartIndex) => {
		if (chartIndex === baselineIndex) return;

		chart.series.forEach((series: ChartSeries) => {
			const differences: DataPoint[] = [];

			series.data.forEach((point: DataPoint, index: number) => {
				const baselinePoint = baselineChart.series[0]?.data[index];
				if (
					baselinePoint &&
					typeof point.y === "number" &&
					typeof baselinePoint.y === "number"
				) {
					differences.push({
						x: point.x,
						y: point.y - baselinePoint.y,
						label: `Diff: ${point.y} - ${baselinePoint.y}`,
					});
				}
			});

			differenceSeries.push({
				name: `${series.name} - ${baselineChart.series[0]?.name || "Baseline"}`,
				data: differences,
				type: "line",
				color: getDifferenceColor(chartIndex),
			});
		});
	});

	return {
		combinedData: createOverlayComparison(chartData, options).combinedData,
		differences: {
			title: "Differences from Baseline",
			series: differenceSeries,
		},
		correlations: null,
		statistics: calculateComparisonStatistics(differenceSeries, {}),
	};
}
