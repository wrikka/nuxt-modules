import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Zoomable Sunburst utilities - Interactive sunburst with zoom functionality
 */

export interface ZoomableSunburstData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		innerRadius: number;
		outerRadius: number;
		startAngle: number;
		endAngle: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
		depth: number;
	}>;
	center: { x: number; y: number };
	maxRadius: number;
	maxDepth: number;
	zoomLevel: number;
	focusedNode?: string;
}


