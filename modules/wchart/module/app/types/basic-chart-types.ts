// Specific chart data types
import type {
	ChartData,
	DataPoint,
	ChartSeries,
	ChartType,
} from './chart-basic';

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

export interface HeatmapData {
	data: number[][];
	xLabels: string[];
	yLabels: string[];
	colors?: string[];
}

export interface CandlestickPoint {
	x: string | number | Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}

export interface CandlestickData {
	title?: string;
	data: CandlestickPoint[];
}
