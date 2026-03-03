import { ref, computed } from "vue";
import type { ChartData } from '@/module/app/types/chart-basic';

export interface ApiDataOptions {
	url: string;
	method?: "GET" | "POST" | "PUT" | "DELETE";
	headers?: Record<string, string>;
	body?: any;
	transform?: (data: any) => ChartData;
	refreshInterval?: number;
}

/**
 * Composable for fetching chart data from APIs
 */
export function useApiData(options: ApiDataOptions) {
	const loading = ref(false);
	const error = ref<string | null>(null);
	const rawData = ref<any>(null);
	const lastFetch = ref<Date | null>(null);

	const chartData = computed<ChartData>(() => {
		if (!rawData.value) return { series: [] };

		if (options.transform) {
			try {
				return options.transform(rawData.value);
			} catch (err) {
				error.value = `Data transformation error: ${err}`;
				return { series: [] };
			}
		}

		// Default transformation - assume API returns ChartData
		return rawData.value as ChartData;
	});

	const fetchData = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await fetch(options.url, {
				method: options.method || "GET",
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				body: options.body ? JSON.stringify(options.body) : undefined,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			rawData.value = await response.json();
			lastFetch.value = new Date();
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Unknown error";
		} finally {
			loading.value = false;
		}
	};

	// Auto-refresh if interval is set
	if (options.refreshInterval && options.refreshInterval > 0) {
		const interval = setInterval(fetchData, options.refreshInterval);

		// Cleanup on unmount (Vue 3)
		const cleanup = () => clearInterval(interval);

		// Return cleanup function
		return {
			chartData,
			loading,
			error,
			fetchData,
			lastFetch,
			cleanup,
		};
	}

	return {
		chartData,
		loading,
		error,
		fetchData,
		lastFetch,
	};
}

/**
 * Utility function to create common API endpoints
 */
export function createApiEndpoint(
	baseUrl: string,
	endpoint: string,
	params?: Record<string, any>,
) {
	const url = new URL(endpoint, baseUrl);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, String(value));
		});
	}
	return url.toString();
}

/**
 * Predefined transformers for common data formats
 */
export const dataTransformers = {
	// Transform array of objects to chart data
	arrayToChart: (
		data: any[],
		config: { xKey: string; yKey: string; seriesName?: string },
	) => {
		const { xKey, yKey, seriesName = "Data" } = config;
		return {
			series: [
				{
					name: seriesName,
					data: data.map((item) => ({
						x: item[xKey],
						y: item[yKey],
					})),
				},
			],
		};
	},

	// Transform time series data
	timeSeriesToChart: (
		data: any[],
		config: { timeKey: string; valueKey: string; seriesName?: string },
	) => {
		const { timeKey, valueKey, seriesName = "Time Series" } = config;
		return {
			series: [
				{
					name: seriesName,
					data: data.map((item) => ({
						x: new Date(item[timeKey]),
						y: item[valueKey],
					})),
				},
			],
		};
	},
};
