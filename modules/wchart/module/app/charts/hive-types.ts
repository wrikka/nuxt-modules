import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Hive utilities - Hive plots for multivariate networks
 */

export interface HiveData extends ChartData {
	axes: Array<{
		name: string;
		angle: number;
		values: Array<{
			id: string;
			value: number;
			color?: string;
			size?: number;
		}>;
	}>;
	links: Array<{
		source: { axis: string; id: string };
		target: { axis: string; id: string };
		value?: number;
		color?: string;
		strength?: number;
	}>;
}


