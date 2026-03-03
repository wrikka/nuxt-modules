import type { CursorPosition as SharedCursorPosition } from "#shared/types/collaboration";
import { useWebSocket } from "@vueuse/core";
import { onUnmounted, ref } from "vue";

interface RealtimeCursorPosition extends SharedCursorPosition {
	userId: string;
	userName: string;
	userColor: string;
	timestamp: number;
}

export interface SelectionChange {
	userId: string;
	userName: string;
	userColor: string;
	selectedObjectIds: string[];
	timestamp: number;
}

export interface CanvasChange {
	userId: string;
	userName: string;
	change: any;
	timestamp: number;
}

export function useRealtimeEditing(projectId: Ref<string>, userId: Ref<string>) {
	const isConnected = ref(false);
	const isConnecting = ref(false);
	const error = ref<string | null>(null);
	const users = ref<Map<string, { name: string; color: string }>>(new Map());
	const cursors = ref<Map<string, RealtimeCursorPosition>>(new Map());
	const selections = ref<Map<string, SelectionChange>>(new Map());
	const pendingChanges = ref<CanvasChange[]>([]);

	const wsUrl = computed(() => {
		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		return `${protocol}//${window.location.host}/api/projects/${projectId.value}/realtime`;
	});

	const { status, data, send, open, close } = useWebSocket(wsUrl, {
		autoReconnect: {
			retries: 3,
			delay: 1000,
			onFailed() {
				error.value = "Failed to connect to real-time server";
			},
		},
	});

	const connect = () => {
		if (isConnecting.value || isConnected.value) return;

		isConnecting.value = true;
		error.value = null;

		try {
			open();
		} catch (e) {
			isConnecting.value = false;
			error.value = e instanceof Error ? e.message : "Connection failed";
		}
	};

	const disconnect = () => {
		close();
		isConnected.value = false;
		users.value.clear();
		cursors.value.clear();
		selections.value.clear();
	};

	const sendCursorPosition = (x: number, y: number) => {
		if (!isConnected.value) return;

		send(JSON.stringify({
			type: "cursor",
			data: { x, y },
		}));
	};

	const sendSelectionChange = (selectedObjectIds: string[]) => {
		if (!isConnected.value) return;

		send(JSON.stringify({
			type: "selection",
			data: { selectedObjectIds },
		}));
	};

	const sendCanvasChange = (change: any) => {
		if (!isConnected.value) {
			pendingChanges.value.push({
				userId: userId.value,
				userName: "You",
				change,
				timestamp: Date.now(),
			});
			return;
		}

		send(JSON.stringify({
			type: "canvas_change",
			data: change,
		}));
	};

	const syncPendingChanges = () => {
		if (!isConnected.value || pendingChanges.value.length === 0) return;

		pendingChanges.value.forEach(change => {
			send(JSON.stringify({
				type: "canvas_change",
				data: change.change,
			}));
		});

		pendingChanges.value = [];
	};

	const broadcastMessage = (type: string, data: any) => {
		if (!isConnected.value) return;

		send(JSON.stringify({ type, data }));
	};

	const handleIncomingMessage = (message: string) => {
		try {
			const parsed = JSON.parse(message);

			switch (parsed.type) {
				case "connected":
					isConnected.value = true;
					isConnecting.value = false;
					error.value = null;
					break;

				case "user_joined":
					users.value.set(parsed.data.userId, {
						name: parsed.data.userName,
						color: parsed.data.userColor,
					});
					break;

				case "user_left":
					users.value.delete(parsed.data.userId);
					cursors.value.delete(parsed.data.userId);
					selections.value.delete(parsed.data.userId);
					break;

				case "cursor":
					cursors.value.set(parsed.data.userId, {
						...parsed.data,
						userId: parsed.data.userId,
						userName: parsed.data.userName,
						userColor: parsed.data.userColor,
						timestamp: Date.now(),
					});
					break;

				case "selection":
					selections.value.set(parsed.data.userId, {
						userId: parsed.data.userId,
						userName: parsed.data.userName,
						userColor: parsed.data.userColor,
						selectedObjectIds: parsed.data.selectedObjectIds,
						timestamp: Date.now(),
					});
					break;

				case "canvas_change":
					return parsed.data;

				case "error":
					error.value = parsed.data.message;
					break;
			}
		} catch (e) {
			console.error("Failed to parse WebSocket message:", e);
		}
	};

	watch(data, (newData) => {
		if (newData) {
			handleIncomingMessage(newData);
		}
	});

	watch(status, (newStatus) => {
		isConnected.value = newStatus === "OPEN";
		isConnecting.value = newStatus === "CONNECTING";

		if (newStatus === "OPEN") {
			syncPendingChanges();
		}
	});

	const getActiveUsers = () => {
		return Array.from(users.value.entries()).map(([id, user]) => ({
			id,
			...user,
		}));
	};

	const getUserColor = (userId: string) => {
		return users.value.get(userId)?.color || "#000000";
	};

	const getUserName = (userId: string) => {
		return users.value.get(userId)?.name || "Unknown";
	};

	const cleanupStaleCursors = () => {
		const now = Date.now();
		const staleThreshold = 5000;

		for (const [userId, cursor] of cursors.value) {
			if (now - cursor.timestamp > staleThreshold) {
				cursors.value.delete(userId);
			}
		}
	};

	const cursorCleanupInterval = setInterval(cleanupStaleCursors, 1000);

	onUnmounted(() => {
		clearInterval(cursorCleanupInterval);
		disconnect();
	});

	return {
		isConnected,
		isConnecting,
		error,
		users,
		cursors,
		selections,
		pendingChanges,
		connect,
		disconnect,
		sendCursorPosition,
		sendSelectionChange,
		sendCanvasChange,
		broadcastMessage,
		getActiveUsers,
		getUserColor,
		getUserName,
	};
}
