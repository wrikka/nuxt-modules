import { onUnmounted, ref } from "vue";

export interface RealtimeEvent {
	type: "content:created" | "content:updated" | "content:deleted" | "content:published" | "content:unpublished";
	path: string;
	item?: any;
	timestamp: number;
	userId?: string;
}

export function useRealtime(path: string = "*") {
	const events = ref<RealtimeEvent[]>([]);
	const isConnected = ref(false);
	const error = ref<Error | null>(null);
	let eventSource: EventSource | null = null;
	let retryCount = 0;
	const MAX_RETRY = 5;

	const connect = () => {
		if (eventSource) {
			eventSource.close();
		}

		try {
			eventSource = new EventSource(`/api/realtime/subscribe?path=${encodeURIComponent(path)}`);

			eventSource.onopen = () => {
				isConnected.value = true;
				error.value = null;
				retryCount = 0;
			};

			eventSource.onmessage = (e) => {
				try {
					const event = JSON.parse(e.data) as RealtimeEvent;
					events.value.push(event);

					// Keep only last 100 events
					if (events.value.length > 100) {
						events.value = events.value.slice(-100);
					}
				} catch (err) {
					console.error("Error parsing realtime event:", err);
				}
			};

			eventSource.onerror = (err) => {
				isConnected.value = false;
				error.value = err as any;

				if (retryCount < MAX_RETRY) {
					retryCount++;
					const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
					setTimeout(connect, delay);
				}
			};
		} catch (err) {
			error.value = err as Error;
		}
	};

	const disconnect = () => {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		isConnected.value = false;
	};

	const publish = async (event: Omit<RealtimeEvent, "timestamp">) => {
		try {
			await $fetch("/api/realtime/publish", {
				method: "POST",
				body: event,
			});
		} catch (err) {
			error.value = err as Error;
			throw err;
		}
	};

	const getHistory = async (limit = 10) => {
		try {
			const data = await $fetch<RealtimeEvent[]>("/api/realtime/history", {
				params: { path, limit },
			});
			return data;
		} catch (err) {
			error.value = err as Error;
			throw err;
		}
	};

	const clearEvents = () => {
		events.value = [];
	};

	// Auto-connect on mount
	connect();

	// Cleanup on unmount
	onUnmounted(() => {
		disconnect();
	});

	return {
		events,
		isConnected,
		error,
		connect,
		disconnect,
		publish,
		getHistory,
		clearEvents,
	};
}
