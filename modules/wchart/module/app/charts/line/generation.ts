import type { LineChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	generateSimpleChartData,
	generateMultiSeriesChartData,
} from './common-chart-generators';

/**
 * Generate line chart data from x and y values
 */
export function generateLineChartData(
	xValues: number[] | string[] | Date[],
	yValues: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		smooth?: boolean;
		showPoints?: boolean;
	} = {},
): LineChartData {
	const {
		title,
		seriesName = "Line",
		color,
		smooth = false,
		showPoints = true,
	} = options;

	const chartData = generateSimpleChartData(xValues, yValues, "line", {
		title,
		seriesName,
		color,
		additionalOptions: { showPoints },
	});

	return { ...chartData, smooth } as LineChartData;
}

/**
 * Generate multi-axis line chart data
 */
export function generateMultiAxisLineChartData(
	xValues: number[] | string[] | Date[],
	axisData: Array<{
		name: string;
		values: number[];
		color?: string;
		yAxisId?: string;
	}>,
	yAxes?: Array<{
		id: string;
		title?: string;
		position?: "left" | "right";
		min?: number;
		max?: number;
	}>,
): LineChartData {
	const series: ChartSeries[] = axisData.map((axisItem, index) => {
		const data: DataPoint[] = xValues.map((x, xIndex) => ({
			x,
			y: axisItem.values[xIndex],
			color: axisItem.color || getSeriesColor(index),
		}));

		return {
			name: axisItem.name,
			data,
			type: "line",
			color: axisItem.color || getSeriesColor(index),
			yAxisId: axisItem.yAxisId || "y",
		};
	});

	return {
		title: "Multi-Axis Line Chart",
		series,
		yAxes: yAxes || [
			{ id: "y", title: "Primary Y-Axis", position: "left" },
			{ id: "y2", title: "Secondary Y-Axis", position: "right" },
		],
	};
}


