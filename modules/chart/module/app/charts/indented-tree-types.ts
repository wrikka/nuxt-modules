import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Indented Tree utilities - Indented tree structures แบบ text
 */

export interface IndentedTreeData extends ChartData {
	lines: Array<{
		id: string;
		text: string;
		level: number;
		x: number;
		y: number;
		width: number;
		height: number;
		parent?: string;
		children: string[];
		expanded: boolean;
		visible: boolean;
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


