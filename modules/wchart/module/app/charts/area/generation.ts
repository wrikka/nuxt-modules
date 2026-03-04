import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	generateSimpleChartData,
	generateMultiSeriesChartData,
} from './common-chart-generators';

/**
 * Generate area chart data from x and y values
 */
export function generateAreaChartData(
	xValues: number[] | string[] | Date[],
	yValues: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		fillOpacity?: number;
	} = {},
): ChartData {
	const { title, seriesName = "Area", color, fillOpacity = 0.3 } = options;

	return generateSimpleChartData(xValues, yValues, "area", {
		title,
		seriesName,
		color,
		additionalOptions: { fillOpacity },
	});
}

/**
 * Generate stacked area chart data
 */
export function generateStackedAreaChartData(
	xValues: number[] | string[] | Date[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
): ChartData {
	return generateMultiSeriesChartData(xValues, seriesData, "area");
}

/**
 * Generate percentage stacked area chart
 */
export function generatePercentageAreaChartData(
	xValues: number[] | string[] | Date[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
): ChartData {
	const series: ChartSeries[] = [];

	// Calculate totals for each x point
	const totals: number[] = [];
	for (let i = 0; i < xValues.length; i++) {
		let total = 0;
		seriesData.forEach((seriesItem) => {
			total += seriesItem.values[i] || 0;
		});
		totals.push(total);
	}

	// Create percentage data
	seriesData.forEach((seriesItem, seriesIndex) => {
		const data: DataPoint[] = xValues.map((x, xIndex) => {
			const value = seriesItem.values[xIndex] || 0;
			const total = totals[xIndex];
			const percentage = total === 0 ? 0 : (value / total) * 100;

			return {
				x,
				y: percentage,
				color: seriesItem.color || getSeriesColor(seriesIndex),
			};
		});

		series.push({
			name: seriesItem.name,
			data,
			type: "area",
			color: seriesItem.color || getSeriesColor(seriesIndex),
		});
	});

	return {
		series,
	};
}


