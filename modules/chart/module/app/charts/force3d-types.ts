import type { ChartData } from '@/module/app/types/chart-basic';

export interface Force3DData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		z: number;
		vx: number;
		vy: number;
		vz: number;
		fx: number;
		fy: number;
		fz: number;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		fixed?: boolean;
		mass?: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
		distance?: number;
	}>;
	forces: {
		repulsion: {
			strength: number;
			distance: number;
			range?: [number, number];
		};
		attraction: {
			strength: number;
			distance?: number;
		};
		gravity: {
			strength: number;
			center?: { x: number; y: number; z: number };
		};
		centering: {
			strength: number;
			center?: { x: number; y: number; z: number };
		};
	};
	simulation: {
		alpha: number;
		alphaMin: number;
		alphaDecay: number;
		velocityDecay: number;
		iterations: number;
	};
}


