import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Normalize histogram to percentages
 */
export function normalizeHistogramData(data: ChartData): ChartData {
	const series = data.series[0];
	if (!series) return data;

	const total = series.data.reduce((sum: number, point: DataPoint) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	if (total === 0) return data;

	const normalizedData = series.data.map((point: DataPoint) => ({
		...point,
		y: typeof point.y === "number" ? (point.y / total) * 100 : 0,
	}));

	return {
		...data,
		series: [
			{
				...series,
				data: normalizedData,
			},
		],
	};
}


