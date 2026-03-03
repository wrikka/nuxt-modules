// Additional chart types interfaces
import type { ChartData, DataPoint } from './chart-basic';

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
