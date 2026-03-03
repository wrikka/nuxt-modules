import type { ChartData, ChartType } from './basic';

// New chart types interfaces
export interface CalendarHeatmapData extends ChartData {
	data: Array<{
		date: Date;
		value: number;
		color?: string;
	}>;
	year?: number;
	month?: number;
	cellSize?: number;
}

export interface SparklineData extends ChartData {
	data: number[];
	lineWidth?: number;
	showPoints?: boolean;
	fill?: boolean;
}

export interface PyramidData extends ChartData {
	segments: Array<{
		name: string;
		value: number;
		color?: string;
	}>;
}

export interface LollipopData extends ChartData {
	orientation?: "horizontal" | "vertical";
	showValues?: boolean;
}

export interface DumbbellData extends ChartData {
	pairs: Array<{
		category: string;
		start: number;
		end: number;
		color?: string;
	}>;
	stats?: {
		averageStart: number;
		averageEnd: number;
		averageDifference: number;
		maxDifference: number;
		minDifference: number;
		improvementCount: number;
		declineCount: number;
	};
}

export interface BulletData extends ChartData {
	measures: Array<{
		title: string;
		value: number;
		target: number;
		ranges: number[];
		colors?: string[];
	}>;
}

export interface TimelineData extends ChartData {
	events: Array<{
		date: Date;
		title: string;
		description?: string;
		color?: string;
	}>;
}

export interface GanttData extends ChartData {
	tasks: Array<{
		id: string;
		name: string;
		start: Date;
		end: Date;
		progress?: number;
		dependencies?: string[];
		color?: string;
	}>;
}

export interface WordCloudData extends ChartData {
	words: Array<{
		text: string;
		size: number;
		color?: string;
	}>;
	fontSize?: (word: string, index: number) => number;
	colors?: string[];
	layout?: string;
	dimensions?: { width: number; height: number };
}

export interface ViolinData extends ChartData {
	distributions: Array<{
		category: string;
		values: number[];
		color?: string;
	}>;
}

export interface DensityData extends ChartData {
	distributions: Array<{
		name: string;
		data: Array<{ x: number; y: number }>;
		color?: string;
	}>;
}

export interface ContourData extends ChartData {
	contours: Array<{
		level: number;
		paths: Array<{ x: number; y: number }[]>;
		color?: string;
	}>;
}

export interface StreamData extends ChartData {
	layers: Array<{
		name: string;
		data: Array<{ x: Date | number; y: number }>;
		color?: string;
	}>;
}

export interface BumpData extends ChartData {
	series: Array<{
		name: string;
		data: Array<{ x: string | number; y: number; rank: number }>;
		color?: string;
	}>;
}

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
	series: Array<{
		name: string;
		data: any[];
		type?: ChartType;
		color?: string;
		links?: any[];
		layout?: any;
		chartType?: string;
	}>;
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
		start: { x: string | number | Date; y: number };
		end: { x: string | number | Date; y: number };
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
