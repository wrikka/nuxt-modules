import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Dendrogram utilities - Hierarchical clustering trees
 */

export interface DendrogramData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		cluster?: number;
		color?: string;
	}>;
	links: Array<{
		source: string;
		target: string;
		distance: number;
		color?: string;
	}>;
	height: number;
	leafNodes: Array<{
		id: string;
		name: string;
		cluster: number;
	}>;
}


