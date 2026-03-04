import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Filter chart data by value range
 */
export function filterDataByRange(
	chartData: ChartData,
	minY?: number,
	maxY?: number,
): ChartData {
	const filteredSeries: ChartSeries[] = chartData.series.map(
		(series: ChartSeries) => ({
			...series,
			data: series.data.filter(
				(point: DataPoint) =>
					(!minY || (typeof point.y === "number" ? point.y >= minY : true)) &&
					(!maxY || (typeof point.y === "number" ? point.y <= maxY : true)),
			),
		}),
	);
	return {
		...chartData,
		series: filteredSeries,
	};
}
