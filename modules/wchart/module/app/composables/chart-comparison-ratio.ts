import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import type { ComparisonOptions, ComparisonResult } from './useChartComparison';
import { getRatioColor, calculateComparisonStatistics } from './chart-comparison-utils';
import { createOverlayComparison } from './chart-comparison-overlay';

/**
 * Create ratio comparison
 */
export function createRatioComparison(
	chartData: ChartData[],
	options: ComparisonOptions,
): ComparisonResult {
	const baselineIndex = options.baselineIndex || 0;
	const baselineChart = chartData[baselineIndex];

	if (!baselineChart) {
		return createOverlayComparison(chartData, options);
	}

	const ratioSeries: ChartSeries[] = [];

	chartData.forEach((chart, chartIndex) => {
		if (chartIndex === baselineIndex) return;

		chart.series.forEach((series: ChartSeries) => {
			const ratios: DataPoint[] = [];

			series.data.forEach((point: DataPoint, index: number) => {
				const baselinePoint = baselineChart.series[0]?.data[index];
				if (
					baselinePoint &&
					typeof point.y === "number" &&
					typeof baselinePoint.y === "number" &&
					baselinePoint.y !== 0
				) {
					ratios.push({
						x: point.x,
						y: point.y / baselinePoint.y,
						label: `Ratio: ${(point.y / baselinePoint.y).toFixed(2)}`,
					});
				}
			});

			ratioSeries.push({
				name: `${series.name} / ${baselineChart.series[0]?.name || "Baseline"}`,
				data: ratios,
				type: "line",
				color: getRatioColor(chartIndex),
			});
		});
	});

	return {
		combinedData: createOverlayComparison(chartData, options).combinedData,
		differences: {
			title: "Ratios vs Baseline",
			series: ratioSeries,
		},
		correlations: null,
		statistics: calculateComparisonStatistics(ratioSeries, {}),
	};
}
