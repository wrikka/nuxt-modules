import type { ChartData } from '@/module/app/types/chart-basic';

export interface AdjacencyData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		color?: string;
		size?: number;
	}>;
	matrix: number[][];
	directed: boolean;
	weighted: boolean;
}


