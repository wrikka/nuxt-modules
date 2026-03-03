// Advanced chart types interfaces
import type { ChartData, ChartSeries, ChartType } from './chart-basic';

export interface MarimekkoData extends ChartData {
	segments: Array<{
		category: string;
		subcategories: Array<{
			name: string;
			value: number;
			color?: string;
		}>;
	}>;
}

export interface NightingaleData extends ChartData {
	petals: Array<{
		category: string;
		value: number;
		color?: string;
	}>;
}

export interface ChordData extends ChartData {
	matrix: number[][];
	labels: string[];
	colors?: string[];
}

export interface SankeyData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
	}>;
	links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}>;
}

export interface PictogramData extends ChartData {
	icons: Array<{
		icon: string;
		value: number;
		maxValue: number;
		color?: string;
	}>;
}

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

export interface StemAndLeafData {
	title?: string;
	stems: Array<{
		stem: number;
		leaves: number[];
	}>;
}

export interface QQData {
	title?: string;
	observed: number[];
	expected: number[];
	distribution?: "normal" | "uniform" | "exponential";
}

export interface ScatterMatrixData {
	title?: string;
	variables: string[];
	data: Array<Record<string, number>>;
	correlations?: Array<Array<number>>;
}

export interface ParallelCoordinatesData extends ChartData {
	dimensions: string[];
	data: Array<Record<string, number>>;
}

export interface CirclePackingData extends ChartData {
	hierarchy: Array<{
		name: string;
		value?: number;
		children?: CirclePackingData["hierarchy"];
		color?: string;
	}>;
}

export interface PackedCirclesData {
	title?: string;
	circles: Array<{
		name: string;
		value: number;
		color?: string;
		group?: string;
	}>;
}

export interface ForceDirectedData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
	}>;
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
	}>;
}

export interface ArcDiagramData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
	}>;
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
	}>;
}

export interface AlluvialData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
	}>;
	links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}>;
}

export interface SlopeData extends ChartData {
	slopes: Array<{
		label: string;
		start: { x: string | number; y: number };
		end: { x: string | number; y: number };
		color?: string;
	}>;
}

export interface ConnectedScatterData extends ChartData {
	points: Array<{
		x: string | number;
		y: number;
		label?: string;
		color?: string;
	}>;
	connectPoints?: boolean;
}

export interface MultiLevelPieData extends ChartData {
	levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
			color?: string;
		}>;
	}>;
}

export interface HexbinData extends ChartData {
	points: Array<{
		x: number;
		y: number;
		value?: number;
	}>;
	binSize?: number;
	colorScale?: string[];
}
