import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Circle Packing Zoom utilities - Zoomable circle packing
 */

export interface CirclePackingZoomData extends ChartData {
	circles: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		r: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
		visible: boolean;
		zoomable: boolean;
	}>;
	center: { x: number; y: number };
	maxRadius: number;
	currentZoomLevel: number;
	focusedNode?: string;
}


