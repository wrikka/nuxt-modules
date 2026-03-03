import { ref, computed, readonly } from "vue";
import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';
import type {
	DatabaseType,
	DatabaseConnection,
	QueryConfig,
	ChartMapping,
	DatabaseOptions,
	QueryResult,
} from "../types/database";
import {
	getTestQuery,
	executeSQLQuery,
	executeSupabaseQuery,
	executePlanetScaleQuery,
	executeMongoQuery,
	executeRedisQuery,
	executeElasticsearchQuery,
	executeInfluxQuery,
	executeBigQuery,
	executeSnowflakeQuery,
} from "../utils/database-executors";
import { getColumnValue } from "../utils/database-utils";

/**
 * Composable for database integration
 */
export function useChartDatabaseIntegration(
	connection: DatabaseConnection,
	options: DatabaseOptions = {},
) {
	const {
		cacheResults = true,
		cacheTimeout = 300000, // 5 minutes
		retryAttempts = 3,
		timeout = 30000,
	} = options;

	const isConnected = ref(false);
	const lastQuery = ref<QueryResult | null>(null);
	const queryCache = ref<
		Map<string, { result: QueryResult; timestamp: number }>
	>(new Map());
	const isLoading = ref(false);

	/**
	 * Test database connection
	 */
	const testConnection = async (): Promise<boolean> => {
		try {
			// This would make a test query based on database type
			const testQuery = getTestQuery(connection.type);
			await executeQuery(testQuery);
			isConnected.value = true;
			return true;
		} catch (error) {
			isConnected.value = false;
			console.error("Database connection test failed:", error);
			return false;
		}
	};

	/**
	 * Execute SQL query
	 */
	const executeQuery = async (
		query: string,
		params?: any[],
	): Promise<QueryResult> => {
		isLoading.value = true;

		try {
			const cacheKey = `${query}-${JSON.stringify(params)}`;

			// Check cache
			if (cacheResults && queryCache.value.has(cacheKey)) {
				const cached = queryCache.value.get(cacheKey)!;
				if (Date.now() - cached.timestamp < cacheTimeout) {
					isLoading.value = false;
					return cached.result;
				}
			}

			const startTime = Date.now();

			// Execute query based on database type
			const result = await executeQueryByType(connection, query, params);
			const executionTime = Date.now() - startTime;

			const queryResult: QueryResult = {
				...result,
				executionTime,
			};

			lastQuery.value = queryResult;

			// Cache result
			if (cacheResults) {
				queryCache.value.set(cacheKey, {
					result: queryResult,
					timestamp: Date.now(),
				});
			}

			return queryResult;
		} catch (error) {
			const queryResult: QueryResult = {
				data: [],
				columns: [],
				rowCount: 0,
				executionTime: 0,
				error: error instanceof Error ? error.message : "Unknown error",
			};
			lastQuery.value = queryResult;
			throw error;
		} finally {
			isLoading.value = false;
		}
	};

	/**
	 * Execute query based on database type
	 */
	const executeQueryByType = async (
		conn: DatabaseConnection,
		query: string,
		params?: any[],
	): Promise<Omit<QueryResult, "executionTime">> => {
		switch (conn.type) {
			case "supabase":
				return executeSupabaseQuery(conn, query, params);
			case "planetscale":
				return executePlanetScaleQuery(conn, query, params);
			case "postgresql":
			case "mysql":
			case "sqlite":
				return executeSQLQuery(conn, query, params);
			case "mongodb":
				return executeMongoQuery(conn, query, params);
			case "redis":
				return executeRedisQuery(conn, query, params);
			case "elasticsearch":
				return executeElasticsearchQuery(conn, query, params);
			case "influxdb":
				return executeInfluxQuery(conn, query, params);
			case "bigquery":
				return executeBigQuery(conn, query, params);
			case "snowflake":
				return executeSnowflakeQuery(conn, query, params);
			default:
				throw new Error(`Unsupported database type: ${conn.type}`);
		}
	};

	/**
	 * Convert query result to chart data
	 */
	const resultToChartData = (
		result: QueryResult,
		mapping: ChartMapping,
		seriesName = "Query Results",
	): ChartData => {
		if (result.error) {
			throw new Error(`Query failed: ${result.error}`);
		}

		const points: DataPoint[] = [];

		result.data.forEach((row) => {
			// Apply filter if provided
			if (mapping.filter && !mapping.filter(row)) {
				return;
			}

			// Custom transform or default mapping
			if (mapping.transform) {
				points.push(mapping.transform(row));
			} else {
				const x = getColumnValue(row, mapping.xColumn);
				const y = getColumnValue(row, mapping.yColumn);
				const label = mapping.labelColumn
					? getColumnValue(row, mapping.labelColumn)
					: undefined;

				if (x !== null && y !== null) {
					points.push({
						x: x,
						y: Number(y),
						label: label?.toString(),
					});
				}
			}
		});

		return {
			series: [
				{
					name: seriesName,
					data: points,
				},
			],
		};
	};

	/**
	 * Build query from configuration
	 */
	const buildQuery = (config: QueryConfig): string => {
		if (config.sql) {
			return config.sql;
		}

		if (!config.table) {
			throw new Error("Either sql or table must be provided");
		}

		const parts = ["SELECT"];

		// Columns
		if (config.columns && config.columns.length > 0) {
			parts.push(config.columns.join(", "));
		} else if (config.aggregation) {
			parts.push(
				`${config.aggregation.function.toUpperCase()}(${config.aggregation.column}) as aggregated_value`,
			);
		} else {
			parts.push("*");
		}

		parts.push(`FROM ${config.table}`);

		// WHERE clause
		if (config.where) {
			const conditions = Object.entries(config.where)
				.map(([key, value]) => `${key} = '${value}'`)
				.join(" AND ");
			parts.push(`WHERE ${conditions}`);
		}

		// GROUP BY
		if (config.groupBy) {
			parts.push(`GROUP BY ${config.groupBy}`);
		}

		// ORDER BY
		if (config.orderBy) {
			parts.push(`ORDER BY ${config.orderBy}`);
		}

		// LIMIT
		if (config.limit) {
			parts.push(`LIMIT ${config.limit}`);
		}

		return parts.join(" ");
	};

	/**
	 * Fetch chart data from database
	 */
	const fetchChartData = async (
		queryConfig: QueryConfig,
		mapping: ChartMapping,
		seriesName?: string,
	): Promise<ChartData> => {
		const query = buildQuery(queryConfig);
		const result = await executeQuery(query);
		return resultToChartData(result, mapping, seriesName);
	};

	/**
	 * Get available database types
	 */
	const getSupportedDatabases = (): DatabaseType[] => {
		return [
			"postgresql",
			"mysql",
			"sqlite",
			"mongodb",
			"redis",
			"elasticsearch",
			"influxdb",
			"clickhouse",
			"bigquery",
			"snowflake",
			"supabase",
			"planetscale",
		];
	};

	/**
	 * Clear query cache
	 */
	const clearCache = () => {
		queryCache.value.clear();
	};

	/**
	 * Get cache statistics
	 */
	const getCacheStats = () => {
		return {
			size: queryCache.value.size,
			totalQueries: queryCache.value.size,
		};
	};

	return {
		// State
		isConnected: readonly(isConnected),
		lastQuery: readonly(lastQuery),
		isLoading: readonly(isLoading),

		// Methods
		testConnection,
		executeQuery,
		fetchChartData,
		buildQuery,
		resultToChartData,
		getSupportedDatabases,
		clearCache,
		getCacheStats,
	};
}
