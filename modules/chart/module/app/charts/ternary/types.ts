import type { ChartData } from '@/module/app/types/chart-basic';

export interface TernaryData extends ChartData {
	points: Array<{
		a: number; // Component A (0-1)
		b: number; // Component B (0-1)
		c: number; // Component C (0-1, calculated as 1-a-b)
		value?: number;
		color?: string;
		label?: string;
		size?: number;
	}>;
	components: {
		a: { name: string; color?: string };
		b: { name: string; color?: string };
		c: { name: string; color?: string };
	};
}


