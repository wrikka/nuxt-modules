import type { DataPoint } from './chart';

/**
 * Data source type
 */
export type DataSourceType =
	| "api"
	| "database"
	| "file"
	| "websocket"
	| "mqtt"
	| "graphql"
	| "rest"
	| "webhook";

/**
 * Data source configuration
 */
export interface DataSource {
	id: string;
	type: DataSourceType;
	name: string;
	url?: string;
	headers?: Record<string, string>;
	query?: string;
	table?: string;
	file?: File;
	topic?: string;
	enabled: boolean;
	refreshInterval?: number; // milliseconds
	transform?: (data: any) => DataPoint[];
	mergeStrategy?: "append" | "replace" | "merge" | "average";
}

/**
 * Multi-source integration options
 */
export interface MultiSourceOptions {
	autoRefresh?: boolean;
	maxConcurrentRequests?: number;
	timeout?: number;
	retryAttempts?: number;
	cacheEnabled?: boolean;
	cacheTimeout?: number;
}

/**
 * Merge result
 */
export interface MergeResult {
	success: boolean;
	data: import('./chart').ChartData;
	sourceCount: number;
	totalPoints: number;
	errors: string[];
	warnings: string[];
}
