import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Matrix utilities - Matrix charts for relationships
 */

export interface MatrixData extends ChartData {
	rows: string[];
	columns: string[];
	values: number[][];
	cellColors?: string[][];
	thresholds?: {
		min?: number;
		max?: number;
		ranges?: Array<{ min: number; max: number; color: string; label?: string }>;
	};
}


