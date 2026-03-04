import type { ChartData } from './base';

export interface BarChartData extends ChartData {
	orientation?: "horizontal" | "vertical";
	stacked?: boolean;
}

export interface LineChartData extends ChartData {
	smooth?: boolean;
	area?: boolean;
	yAxes?: Array<{
		id: string;
		title?: string;
		position?: "left" | "right";
		min?: number;
		max?: number;
	}>;
}

export interface PieChartData extends ChartData {
	innerRadius?: number;
	outerRadius?: number;
	donut?: boolean;
}

export interface ScatterData extends ChartData {
	xAxis?: string;
	yAxis?: string;
	trendLine?: boolean;
}
