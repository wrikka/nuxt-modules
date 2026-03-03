import type { ChartData, DataPoint } from './base';

export interface BoxPlotData extends ChartData {
	outliers?: DataPoint[];
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
