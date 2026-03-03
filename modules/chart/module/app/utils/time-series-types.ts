import type { DataPoint } from '@/module/app/types/chart-basic';

/**
 * Time series options
 */
export interface TimeSeriesOptions {
	dateFormat?: string;
	timeZone?: string;
	granularity?:
		| "second"
		| "minute"
		| "hour"
		| "day"
		| "week"
		| "month"
		| "year";
	fillGaps?: boolean;
	interpolateMethod?: "linear" | "step" | "cubic";
	rollingWindow?: number;
}

/**
 * Time range interface
 */
export interface TimeRange {
	start: Date;
	end: Date;
}

/**
 * Time series point with enhanced features
 */
export interface TimeSeriesPoint extends DataPoint {
	timestamp: Date;
	value: number;
	metadata?: {
		quality?: number;
		source?: string;
		tags?: string[];
		grouped?: boolean;
		groupSize?: number;
		aggregation?: string;
		anomaly?: boolean;
		zScore?: number;
		rollingWindow?: {
			size: number;
			operation: string;
		};
	};
}
