import type { ChartData } from './base';

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
