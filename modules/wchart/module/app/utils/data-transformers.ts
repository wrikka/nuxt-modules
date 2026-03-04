import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { DEFAULT_COLORS } from './chart-constants';

/**
 * Transform array data to chart data format
 */
export function transformArrayToChartData(
	data: number[][],
	labels?: string[],
	seriesNames?: string[],
): ChartData {
	const series: ChartSeries[] = [];
	for (let i = 0; i < data.length; i++) {
		const seriesData: DataPoint[] = data[i].map((value, index) => ({
			x: labels ? labels[index] : index,
			y: value,
		}));
		series.push({
			name: seriesNames ? seriesNames[i] : `Series ${i + 1}`,
			data: seriesData,
			color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
		});
	}
	return { series };
}

/**
 * Transform object data to chart data format
 */
export function transformObjectToChartData(
	data: Record<string, any>[],
	xKey: string,
	yKey: string,
	name?: string,
): ChartData {
	const seriesData: DataPoint[] = data.map((item) => ({
		x: item[xKey],
		y: item[yKey],
		label: item.label || item.name,
	}));
	return {
		series: [
			{
				name: name || "Data",
				data: seriesData,
			},
		],
	};
}
