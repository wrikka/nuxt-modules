export interface WebhookConfig {
	url: string;
	headers?: Record<string, string>;
	retryCount?: number;
	timeout?: number;
}

export interface WebhookEvent {
	id: string;
	type: "recording.started" | "recording.stopped" | "recording.paused" | "recording.resumed" | "recording.error" | "upload.completed" | "upload.failed";
	timestamp: number;
	payload: Record<string, unknown>;
}

export interface WebhookState {
	isEnabled: boolean;
	config?: WebhookConfig;
	queue: WebhookEvent[];
	isProcessing: boolean;
	lastError?: string;
}

const STORAGE_KEY = "wrecorder-webhook-config";

export const useWebhookIntegration = () => {
	const state = reactive<WebhookState>({
		isEnabled: false,
		queue: [],
		isProcessing: false,
	});

	let processInterval: ReturnType<typeof setInterval> | null = null;

	const loadConfig = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const config = JSON.parse(stored);
				state.config = config;
				state.isEnabled = !!config.url;
			} catch {
				state.config = undefined;
			}
		}
	};

	const saveConfig = () => {
		if (typeof window === "undefined" || !state.config) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
	};

	const setConfig = (config: WebhookConfig) => {
		state.config = {
			retryCount: 3,
			timeout: 10000,
			...config,
		};
		state.isEnabled = true;
		saveConfig();
	};

	const disable = () => {
		state.isEnabled = false;
		if (processInterval) {
			clearInterval(processInterval);
			processInterval = null;
		}
	};

	const enable = () => {
		if (state.config?.url) {
			state.isEnabled = true;
			startProcessing();
		}
	};

	const sendEvent = async (event: Omit<WebhookEvent, "id" | "timestamp">): Promise<boolean> => {
		if (!state.isEnabled || !state.config) return false;

		const fullEvent: WebhookEvent = {
			...event,
			id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			timestamp: Date.now(),
		};

		// Add to queue
		state.queue.push(fullEvent);
		
		// Try to send immediately
		return await processQueue();
	};

	const processQueue = async (): Promise<boolean> => {
		if (!state.isEnabled || !state.config || state.queue.length === 0 || state.isProcessing) {
			return false;
		}

		state.isProcessing = true;
		state.lastError = undefined;

		const event = state.queue[0];
		const { url, headers = {}, retryCount = 3, timeout = 10000 } = state.config;

		let attempt = 0;
		let success = false;

		while (attempt < retryCount && !success) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), timeout);

				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...headers,
					},
					body: JSON.stringify(event),
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (response.ok) {
					success = true;
					state.queue.shift(); // Remove sent event
				} else {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
			} catch (error) {
				attempt++;
				state.lastError = error instanceof Error ? error.message : String(error);
				
				if (attempt < retryCount) {
					await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
				}
			}
		}

		state.isProcessing = false;
		return success;
	};

	const startProcessing = () => {
		if (processInterval) return;
		
		processInterval = setInterval(() => {
			if (state.queue.length > 0) {
				processQueue();
			}
		}, 5000);
	};

	const testWebhook = async (): Promise<boolean> => {
		if (!state.config?.url) return false;

		return await sendEvent({
			type: "recording.started",
			payload: {
				test: true,
				message: "Test webhook event from WRecorder",
			},
		});
	};

	// Helper methods for common events
	const notifyRecordingStarted = (details: Record<string, unknown> = {}) => {
		return sendEvent({
			type: "recording.started",
			payload: details,
		});
	};

	const notifyRecordingStopped = (details: Record<string, unknown> = {}) => {
		return sendEvent({
			type: "recording.stopped",
			payload: details,
		});
	};

	const notifyUploadCompleted = (details: Record<string, unknown> = {}) => {
		return sendEvent({
			type: "upload.completed",
			payload: details,
		});
	};

	const notifyError = (error: Error, context: Record<string, unknown> = {}) => {
		return sendEvent({
			type: "recording.error",
			payload: {
				message: error.message,
				stack: error.stack,
				...context,
			},
		});
	};

	onMounted(() => {
		loadConfig();
		if (state.isEnabled) {
			startProcessing();
		}
	});

	onUnmounted(() => {
		if (processInterval) {
			clearInterval(processInterval);
		}
	});

	return {
		state: readonly(state),
		setConfig,
		enable,
		disable,
		sendEvent,
		testWebhook,
		notifyRecordingStarted,
		notifyRecordingStopped,
		notifyUploadCompleted,
		notifyError,
		processQueue,
	};
};
