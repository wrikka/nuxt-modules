import type { ScatterData, DataPoint, ChartSeries } from '../../types/chart-basic';
import { getSeriesColor } from '../../utils/chart-utils';

/**
 * Generate scatter plot data from x and y coordinates
 */
export function generateScatterData(
	xValues: number[],
	yValues: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		size?: number[] | ((point: { x: number; y: number }) => number);
	} = {},
): ScatterData {
	const { title, seriesName = "Points", color } = options;

	const data: DataPoint[] = xValues.map((x, index) => ({
		x,
		y: yValues[index]!,
		color: color || getSeriesColor(0),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "scatter",
			},
		],
	};
}

/**
 * Generate scatter plot from data points array
 */
export function generateScatterFromPoints(
	points: Array<{
		x: number;
		y: number;
		label?: string;
		color?: string;
		size?: number;
	}>,
	options: {
		title?: string;
		seriesName?: string;
	} = {},
): ScatterData {
	const { title, seriesName = "Data Points" } = options;

	const data: DataPoint[] = points.map((point, index) => ({
		x: point.x,
		y: point.y,
		label: point.label,
		color: point.color || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "scatter",
			},
		],
	};
}

/**
 * Generate multiple series scatter plot
 */
export function generateMultiScatterData(
	seriesData: Array<{
		name: string;
		points: Array<{ x: number; y: number; label?: string }>;
		color?: string;
	}>,
): ScatterData {
	const series: ChartSeries[] = seriesData.map((seriesItem, index) => {
		const data: DataPoint[] = seriesItem.points.map((point) => ({
			x: point.x,
			y: point.y,
			label: point.label,
			color: seriesItem.color || getSeriesColor(index),
		}));

		return {
			name: seriesItem.name,
			data,
			type: "scatter",
			color: seriesItem.color || getSeriesColor(index),
		};
	});

	return {
		series,
	};
}


