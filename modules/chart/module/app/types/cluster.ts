import type { ChartData } from './chart';

export interface ClusterData extends ChartData {
	points: Array<{
		id: string;
		x: number;
		y: number;
		cluster: number;
		color?: string;
		size?: number;
	}>;
	centroids: Array<{
		cluster: number;
		x: number;
		y: number;
		color: string;
		size: number;
	}>;
	clusters: number;
	algorithm: string;
}
