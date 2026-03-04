import type { ChartData } from '@/module/app/types/chart-basic';

export interface IcicleData extends ChartData {
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
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	maxDepth: number;
}


