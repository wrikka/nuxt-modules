import type { ChartData, ChartSeries, ChartType } from './base';

export interface ComboData extends ChartData {
	series: Array<
		ChartSeries & {
			chartType?: ChartType;
		}
	>;
}

export interface ParetoData extends ChartData {
	cumulativeLine?: boolean;
}

export interface StepData extends ChartData {
	stepPosition?: "start" | "middle" | "end";
}

export interface RangeData extends ChartData {
	ranges: Array<{
		category: string;
		min: number;
		max: number;
		color?: string;
	}>;
}

export interface ErrorBarData extends ChartData {
	errorBars: Array<{
		x: string | number;
		y: number;
		errorMin: number;
		errorMax: number;
		color?: string;
	}>;
}

export interface ForestData extends ChartData {
	studies: Array<{
		name: string;
		effect: number;
		ciLow: number;
		ciHigh: number;
		weight?: number;
		color?: string;
	}>;
}

export interface DotData extends ChartData {
	dots: Array<{
		category: string;
		value: number;
		color?: string;
		size?: number;
	}>;
}
