import { ref, reactive, onMounted, onUnmounted } from "vue";
import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';

export interface RealTimeOptions {
	url: string;
	type: "websocket" | "sse";
	reconnectInterval?: number;
	maxRetries?: number;
	transform?: (data: any) => DataPoint | DataPoint[];
	bufferSize?: number;
}

/**
 * Composable for real-time chart data streaming
 */
export function useRealTimeData(options: RealTimeOptions) {
	const connected = ref(false);
	const error = ref<string | null>(null);
	const retryCount = ref(0);

	const chartData = reactive<ChartData>({
		series: [
			{
				name: "Real-time Data",
				data: [],
			},
		],
	});

	let connection: WebSocket | EventSource | null = null;
	let reconnectTimer: number | null = null;

	const connect = () => {
		try {
			if (options.type === "websocket") {
				connection = new WebSocket(options.url);

				connection.onopen = () => {
					connected.value = true;
					error.value = null;
					retryCount.value = 0;
				};

				connection.onmessage = (event) => {
					try {
						const rawData = JSON.parse(event.data);
						addDataPoint(rawData);
					} catch (err) {
						error.value = `Failed to parse WebSocket message: ${err}`;
					}
				};

				connection.onclose = () => {
					connected.value = false;
					scheduleReconnect();
				};

				connection.onerror = (err) => {
					error.value = "WebSocket connection error";
					console.error("WebSocket error:", err);
				};
			} else if (options.type === "sse") {
				connection = new EventSource(options.url);

				connection.onopen = () => {
					connected.value = true;
					error.value = null;
					retryCount.value = 0;
				};

				connection.onmessage = (event) => {
					try {
						const rawData = JSON.parse(event.data);
						addDataPoint(rawData);
					} catch (err) {
						error.value = `Failed to parse SSE message: ${err}`;
					}
				};

				connection.onerror = (err) => {
					error.value = "SSE connection error";
					connected.value = false;
					scheduleReconnect();
				};
			}
		} catch (err) {
			error.value = `Connection failed: ${err}`;
			scheduleReconnect();
		}
	};

	const disconnect = () => {
		if (connection) {
			if (options.type === "websocket") {
				(connection as WebSocket).close();
			} else {
				(connection as EventSource).close();
			}
			connection = null;
		}
		connected.value = false;
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
	};

	const scheduleReconnect = () => {
		if (options.maxRetries && retryCount.value >= options.maxRetries) {
			error.value = `Max retries (${options.maxRetries}) reached`;
			return;
		}

		retryCount.value++;
		const interval = options.reconnectInterval || 5000;

		reconnectTimer = window.setTimeout(() => {
			connect();
		}, interval);
	};

	const addDataPoint = (rawData: any) => {
		let dataPoints: DataPoint[];

		if (options.transform) {
			const transformed = options.transform(rawData);
			dataPoints = Array.isArray(transformed) ? transformed : [transformed];
		} else {
			// Default transformation
			dataPoints = [
				{
					x: rawData.x || rawData.timestamp || new Date(),
					y: rawData.y || rawData.value || 0,
				},
			];
		}

		dataPoints.forEach((point) => {
			chartData.series[0].data.push(point);

			// Maintain buffer size
			if (
				options.bufferSize &&
				chartData.series[0].data.length > options.bufferSize
			) {
				chartData.series[0].data.shift();
			}
		});
	};

	const clearData = () => {
		chartData.series[0].data = [];
	};

	const sendMessage = (message: any) => {
		if (connection && options.type === "websocket" && connected.value) {
			(connection as WebSocket).send(JSON.stringify(message));
		}
	};

	onMounted(() => {
		connect();
	});

	onUnmounted(() => {
		disconnect();
	});

	return {
		chartData,
		connected,
		error,
		retryCount,
		connect,
		disconnect,
		clearData,
		sendMessage,
	};
}

/**
 * Utility for creating WebSocket URLs
 */
export function createWebSocketUrl(
	baseUrl: string,
	params?: Record<string, any>,
) {
	const url = new URL(baseUrl);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, String(value));
		});
	}
	return url.toString().replace(/^http/, "ws");
}

/**
 * Predefined transformers for common real-time data formats
 */
export const realTimeTransformers = {
	// Transform timestamped value
	timestampedValue: (data: any) => ({
		x: new Date(data.timestamp),
		y: data.value,
	}),

	// Transform coordinate data
	coordinate: (data: any) => ({
		x: data.x,
		y: data.y,
	}),

	// Transform multiple series
	multiSeries: (data: any) => {
		return Object.entries(data).map(([key, value]: [string, any]) => ({
			x: value.timestamp || new Date(),
			y: value.value || value,
		}));
	},
};
