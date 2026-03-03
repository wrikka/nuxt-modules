import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Collapsible Tree utilities - Interactive collapsible trees
 */

export interface CollapsibleTreeData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		parent?: string;
		children: string[];
		value?: number;
		color?: string;
		collapsed: boolean;
		visible: boolean;
		depth: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		color?: string;
		width?: number;
		visible: boolean;
	}>;
	layout: "tree" | "cluster" | "radial";
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	maxDepth: number;
}


