import { ref, readonly } from "vue";
import type { ChartData } from '@/module/app/types/chart-basic';

export function useApiChartData(
	options: {
		apiUrl?: string;
		method?: "GET" | "POST";
		headers?: Record<string, string>;
		autoFetch?: boolean;
		pollInterval?: number;
	} = {},
) {
	const {
		apiUrl = "",
		method = "GET",
		headers = {},
		autoFetch = false,
		pollInterval,
	} = options;

	const chartData = ref<ChartData | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const isPolling = ref(false);
	let pollTimer: NodeJS.Timeout | null = null;

	const fetchData = async (url?: string, requestOptions?: RequestInit) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await fetch(url || apiUrl, {
				method,
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				...requestOptions,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			chartData.value = data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch data";
		} finally {
			loading.value = false;
		}
	};

	const postData = async (payload: any, url?: string) => {
		await fetchData(url, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	};

	const startPolling = (interval = pollInterval || 30000) => {
		if (pollTimer) return;
		isPolling.value = true;
		pollTimer = setInterval(() => {
			fetchData();
		}, interval);
	};

	const stopPolling = () => {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
		isPolling.value = false;
	};

	const clearData = () => {
		chartData.value = null;
		error.value = null;
	};

	const setApiUrl = (newUrl: string) => {
		options.apiUrl = newUrl;
	};

	if (autoFetch && apiUrl) {
		fetchData();
	}

	if (pollInterval && autoFetch) {
		startPolling(pollInterval);
	}

	return {
		chartData: readonly(chartData),
		loading: readonly(loading),
		error: readonly(error),
		isPolling: readonly(isPolling),
		fetchData,
		postData,
		startPolling,
		stopPolling,
		clearData,
		setApiUrl,
	};
}
