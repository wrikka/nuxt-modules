import type { ChartData } from './basic';

// Specific chart data types
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

// Additional chart types
export interface BoxPlotData extends ChartData {
	outliers?: any[];
	quartiles?: number[];
}

export interface FunnelData extends ChartData {
	stages: Array<{
		name: string;
		value: number;
		color?: string;
	}>;
}

export interface GaugeData extends ChartData {
	value: number;
	min: number;
	max: number;
	thresholds?: Array<{
		value: number;
		color: string;
		label?: string;
	}>;
}

export interface RadarData extends ChartData {
	categories: string[];
}

export interface SunburstData extends ChartData {
	hierarchy: Array<{
		name: string;
		value: number;
		children?: SunburstData["hierarchy"];
	}>;
}

export interface TreemapData extends ChartData {
	hierarchy: Array<{
		name: string;
		value: number;
		children?: TreemapData["hierarchy"];
	}>;
}

export interface WaterfallData extends ChartData {
	stages: Array<{
		name: string;
		value: number;
		color?: string;
		isTotal?: boolean;
	}>;
}
