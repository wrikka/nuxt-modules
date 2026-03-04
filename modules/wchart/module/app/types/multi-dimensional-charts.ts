import type { ChartData } from './base';

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
