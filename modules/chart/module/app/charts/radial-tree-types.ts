import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Radial tree utilities - Radial tree layouts
 */

export interface TreeNode {
	id: string;
	name: string;
	children?: TreeNode[];
}

export interface RadialTreeData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		angle: number;
		radius: number;
		parent?: string;
		children: string[];
		color?: string;
		size?: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		color?: string;
		width?: number;
	}>;
	center: { x: number; y: number };
	maxRadius: number;
	maxDepth: number;
}


