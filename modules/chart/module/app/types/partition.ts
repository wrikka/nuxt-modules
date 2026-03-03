import type { ChartData } from './chart';

export interface PartitionData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
	}>;
	layout: "treemap" | "sunburst" | "icicle";
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	maxDepth: number;
}
