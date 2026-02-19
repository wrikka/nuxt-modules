import { computed, onMounted, readonly, ref } from "vue";

const sessionId = ref<string>("");
const isConnected = ref(false);
const viewers = ref(0);
const isPresenterMode = ref(false);
const syncEnabled = ref(true);

export function usePresenterSync() {
	let ws: WebSocket | null = null;
	let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

	const connectionStatus = computed(() => {
		if (isConnected.value) return "connected";
		if (sessionId.value) return "connecting";
		return "disconnected";
	});

	function connect(session: string) {
		sessionId.value = session;
		isPresenterMode.value = true;

		// In a real implementation, this would connect to a WebSocket server
		// ws = new WebSocket(`wss://api.example.com/wslide/${session}`);
		// ws.onopen = () => { isConnected.value = true; };
		// ws.onmessage = handleMessage;

		// Mock connection for now
		setTimeout(() => {
			isConnected.value = true;
		}, 500);
	}

	function disconnect() {
		if (ws) {
			ws.close();
			ws = null;
		}
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
		isConnected.value = false;
		isPresenterMode.value = false;
		sessionId.value = "";
	}

	function broadcastSlide(index: number, click: number) {
		if (!isConnected.value || !syncEnabled.value) return;

		const message = {
			type: "slide-change",
			sessionId: sessionId.value,
			index,
			click,
			timestamp: Date.now(),
		};

		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		}

		// Also broadcast via BroadcastChannel for same-tab sync
		if (typeof BroadcastChannel !== "undefined") {
			const channel = new BroadcastChannel("wslide-sync");
			channel.postMessage(message);
			channel.close();
		}
	}

	function toggleSync() {
		syncEnabled.value = !syncEnabled.value;
	}

	onMounted(() => {
		// Listen for sync messages from other tabs
		if (typeof BroadcastChannel !== "undefined") {
			const channel = new BroadcastChannel("wslide-sync");
			channel.onmessage = (event) => {
				if (event.data.type === "slide-change" && !isPresenterMode.value) {
					// Update viewer's slide position
				}
			};
		}
	});

	return {
		sessionId: readonly(sessionId),
		isConnected: readonly(isConnected),
		viewers: readonly(viewers),
		syncEnabled: readonly(syncEnabled),
		connectionStatus,
		connect,
		disconnect,
		broadcastSlide,
		toggleSync,
	};
}
