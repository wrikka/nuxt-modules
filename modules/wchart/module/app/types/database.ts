/**
 * Database type
 */
export type DatabaseType =
	| "postgresql"
	| "mysql"
	| "sqlite"
	| "mongodb"
	| "redis"
	| "elasticsearch"
	| "influxdb"
	| "clickhouse"
	| "bigquery"
	| "snowflake"
	| "supabase"
	| "planetscale";

/**
 * Connection configuration
 */
export interface DatabaseConnection {
	type: DatabaseType;
	host?: string;
	port?: number;
	database?: string;
	username?: string;
	password?: string;
	ssl?: boolean;
	connectionString?: string; // For Supabase, PlanetScale, etc.
	apiKey?: string; // For BigQuery, Snowflake, etc.
	projectId?: string; // For BigQuery
	account?: string; // For Snowflake
	warehouse?: string; // For Snowflake
}

/**
 * Query configuration
 */
export interface QueryConfig {
	sql?: string;
	table?: string;
	columns?: string[];
	where?: Record<string, any>;
	orderBy?: string;
	limit?: number;
	groupBy?: string;
	aggregation?: {
		column: string;
		function: "count" | "sum" | "avg" | "min" | "max";
	};
}

/**
 * Chart mapping configuration
 */
export interface ChartMapping {
	xColumn: string;
	yColumn: string;
	labelColumn?: string;
	seriesColumn?: string;
	filter?: (row: any) => boolean;
	transform?: (row: any) => import("../types/chart").DataPoint;
}

/**
 * Database integration options
 */
export interface DatabaseOptions {
	cacheResults?: boolean;
	cacheTimeout?: number;
	retryAttempts?: number;
	timeout?: number;
}

/**
 * Query result
 */
export interface QueryResult {
	data: any[];
	columns: string[];
	rowCount: number;
	executionTime: number;
	error?: string;
}
