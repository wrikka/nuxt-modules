import { ref, computed, reactive, readonly } from "vue";
import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import type {
	DataSourceType,
	DataSource,
	MultiSourceOptions,
	MergeResult,
} from "../types/data-source";
import {
	fetchFromAPI,
	fetchFromGraphQL,
	fetchFromDatabase,
	fetchFromFile,
	fetchFromWebSocket,
	fetchFromMQTT,
	fetchFromWebhook,
} from "../utils/data-source-fetchers";
import {
	defaultTransform,
	chunkArray,
	getSourceColor,
} from "../utils/data-integration-utils";

/**
 * Integration state
 */
interface IntegrationState {
	sources: DataSource[];
	isLoading: boolean;
	lastUpdate: Date | null;
	errors: Array<{ sourceId: string; error: string; timestamp: Date }>;
	activeConnections: number;
}

/**
 * Composable for multi-source data integration
 */
export function useChartMultiSourceIntegration(
	options: MultiSourceOptions = {},
) {
	const {
		autoRefresh = true,
		maxConcurrentRequests = 5,
		timeout = 10000,
		retryAttempts = 3,
		cacheEnabled = true,
		cacheTimeout = 300000, // 5 minutes
	} = options;

	const state = reactive<IntegrationState>({
		sources: [],
		isLoading: false,
		lastUpdate: null,
		errors: [],
		activeConnections: 0,
	});

	const cache = ref<Map<string, { data: any; timestamp: number }>>(new Map());

	/**
	 * Add data source
	 */
	const addDataSource = (source: Omit<DataSource, "id">): string => {
		const id = `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newSource: DataSource = { ...source, id };
		state.sources.push(newSource);
		return id;
	};

	/**
	 * Remove data source
	 */
	const removeDataSource = (id: string) => {
		const index = state.sources.findIndex((source) => source.id === id);
		if (index !== -1) {
			state.sources.splice(index, 1);
		}
	};

	/**
	 * Update data source
	 */
	const updateDataSource = (id: string, updates: Partial<DataSource>) => {
		const source = state.sources.find((s) => s.id === id);
		if (source) {
			Object.assign(source, updates);
		}
	};

	/**
	 * Enable/disable data source
	 */
	const toggleDataSource = (id: string, enabled: boolean) => {
		updateDataSource(id, { enabled });
	};

	/**
	 * Fetch data from single source
	 */
	const fetchFromSource = async (source: DataSource): Promise<DataPoint[]> => {
		const cacheKey = `source_${source.id}`;

		// Check cache
		if (cacheEnabled && cache.value.has(cacheKey)) {
			const cached = cache.value.get(cacheKey)!;
			if (Date.now() - cached.timestamp < cacheTimeout) {
				return cached.data;
			}
		}

		let attempts = 0;
		let lastError: Error | null = null;

		while (attempts < retryAttempts) {
			try {
				let rawData: any;

				switch (source.type) {
					case "api":
					case "rest":
						rawData = await fetchFromAPI(source, timeout);
						break;
					case "graphql":
						rawData = await fetchFromGraphQL(source, timeout);
						break;
					case "database":
						rawData = await fetchFromDatabase(source);
						break;
					case "file":
						rawData = await fetchFromFile(source);
						break;
					case "websocket":
						rawData = await fetchFromWebSocket(source);
						break;
					case "mqtt":
						rawData = await fetchFromMQTT(source);
						break;
					case "webhook":
						rawData = await fetchFromWebhook(source);
						break;
					default:
						throw new Error(`Unsupported data source type: ${source.type}`);
				}

				// Apply transform
				let points: DataPoint[] = [];
				if (source.transform) {
					points = source.transform(rawData);
				} else {
					// Default transformation
					points = defaultTransform(rawData);
				}

				// Cache result
				if (cacheEnabled) {
					cache.value.set(cacheKey, {
						data: points,
						timestamp: Date.now(),
					});
				}

				return points;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error("Unknown error");
				attempts++;
				if (attempts < retryAttempts) {
					await new Promise((resolve) => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
				}
			}
		}

		// All attempts failed
		state.errors.push({
			sourceId: source.id,
			error: lastError?.message || "Failed to fetch data",
			timestamp: new Date(),
		});

		return [];
	};

	/**
	 * Fetch and merge data from all enabled sources
	 */
	const fetchAllData = async (): Promise<MergeResult> => {
		state.isLoading = true;
		state.errors = [];

		try {
			const enabledSources = state.sources.filter((source) => source.enabled);

			if (enabledSources.length === 0) {
				return {
					success: true,
					data: { series: [] },
					sourceCount: 0,
					totalPoints: 0,
					errors: [],
					warnings: ["No enabled data sources"],
				};
			}

			// Limit concurrent requests
			const batches = chunkArray(enabledSources, maxConcurrentRequests);
			let allPoints: DataPoint[][] = [];

			for (const batch of batches) {
				const batchPromises = batch.map((source) => fetchFromSource(source));
				const batchResults = await Promise.allSettled(batchPromises);

				batchResults.forEach((result, index) => {
					const source = batch[index];
					if (result.status === "fulfilled") {
						allPoints.push(result.value);
					} else {
						state.errors.push({
							sourceId: source.id,
							error: result.reason?.message || "Request failed",
							timestamp: new Date(),
						});
						allPoints.push([]); // Empty array for failed source
					}
				});
			}

			// Merge data from all sources
			const mergedData = mergeDataFromSources(allPoints, enabledSources);

			state.lastUpdate = new Date();

			const warnings: string[] = [];
			if (state.errors.length > 0) {
				warnings.push(`${state.errors.length} data sources failed to load`);
			}

			return {
				success: true,
				data: mergedData,
				sourceCount: enabledSources.length,
				totalPoints: mergedData.series.reduce(
					(sum, series) => sum + series.data.length,
					0,
				),
				errors: state.errors.map((e) => e.error),
				warnings,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			return {
				success: false,
				data: { series: [] },
				sourceCount: 0,
				totalPoints: 0,
				errors: [errorMessage],
				warnings: [],
			};
		} finally {
			state.isLoading = false;
		}
	};

	/**
	 * Merge data from multiple sources
	 */
	const mergeDataFromSources = (
		dataArrays: DataPoint[][],
		sources: DataSource[],
	): ChartData => {
		const mergedSeries: ChartSeries[] = [];

		sources.forEach((source, index) => {
			const points = dataArrays[index];
			if (points.length === 0) return;

			const seriesName = source.name || `Source ${index + 1}`;

			mergedSeries.push({
				name: seriesName,
				data: points,
				type: "line", // Default type, could be configurable
				color: getSourceColor(index),
			});
		});

		return {
			title: `Multi-source Data (${sources.length} sources)`,
			series: mergedSeries,
		};
	};

	/**
	 * Start auto-refresh for all sources
	 */
	const startAutoRefresh = () => {
		if (!autoRefresh) return;

		state.sources.forEach((source) => {
			if (source.enabled && source.refreshInterval) {
				const intervalId = setInterval(async () => {
					if (source.enabled) {
						try {
							await fetchFromSource(source);
						} catch (error) {
							console.warn(
								`Auto-refresh failed for source ${source.id}:`,
								error,
							);
						}
					}
				}, source.refreshInterval);

				// Store interval ID for cleanup (would need additional state management)
			}
		});
	};

	/**
	 * Stop auto-refresh
	 */
	const stopAutoRefresh = () => {
		// Clear all intervals (would need to track them)
	};

	/**
	 * Get integration statistics
	 */
	const getStatistics = () => {
		const enabledSources = state.sources.filter((s) => s.enabled);
		const totalErrors = state.errors.length;
		const recentErrors = state.errors.filter(
			(e) => Date.now() - e.timestamp.getTime() < 3600000, // Last hour
		).length;

		return {
			totalSources: state.sources.length,
			enabledSources: enabledSources.length,
			disabledSources: state.sources.length - enabledSources.length,
			totalErrors,
			recentErrors,
			lastUpdate: state.lastUpdate,
			cacheSize: cache.value.size,
			activeConnections: state.activeConnections,
		};
	};

	/**
	 * Clear cache
	 */
	const clearCache = () => {
		cache.value.clear();
	};

	/**
	 * Export configuration
	 */
	const exportConfiguration = () => {
		return {
			sources: state.sources.map((source) => ({
				...source,
				// Don't export sensitive data like headers with auth tokens
				headers: source.headers ? Object.keys(source.headers) : undefined,
			})),
			options,
		};
	};

	/**
	 * Import configuration
	 */
	const importConfiguration = (config: any) => {
		if (config.sources) {
			state.sources = config.sources;
		}
	};

	return {
		// State
		sources: readonly(state.sources),
		isLoading: state.isLoading,
		lastUpdate: state.lastUpdate,
		errors: readonly(state.errors),
		activeConnections: state.activeConnections,

		// Methods
		addDataSource,
		removeDataSource,
		updateDataSource,
		toggleDataSource,
		fetchAllData,
		startAutoRefresh,
		stopAutoRefresh,
		getStatistics,
		clearCache,
		exportConfiguration,
		importConfiguration,
	};
}
