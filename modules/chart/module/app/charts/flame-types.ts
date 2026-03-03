import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Flame types - Type definitions for flame graph utilities
 */

export interface FlameData extends ChartData {
	frames: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		value: number;
		level: number;
		parent?: string;
		children: string[];
		color?: string;
		tooltip?: string;
	}>;
	maxDepth: number;
	totalValue: number;
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}


