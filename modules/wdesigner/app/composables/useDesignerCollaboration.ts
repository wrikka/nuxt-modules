import type { DesignerLayerItem } from "./useDesignerDocument";
import { computed, ref, shallowRef } from "vue";

// Types
export interface CollaborationUser {
	id: string;
	name: string;
	color: string;
	cursor: { x: number; y: number } | null;
	selectedObjectId: string | null;
	isOnline: boolean;
	joinedAt: Date;
}

export interface CollaborationState {
	isConnected: boolean;
	isHost: boolean;
	roomId: string | null;
	users: CollaborationUser[];
	localUserId: string;
}

export interface CRDTOperation {
	type: "object:add" | "object:modify" | "object:remove" | "layer:reorder" | "artboard:resize";
	payload: Record<string, unknown>;
	timestamp: number;
	userId: string;
	operationId: string;
}

export interface WebRTCMessage {
	type: "cursor" | "operation" | "user:join" | "user:leave" | "state:sync" | "ping" | "pong";
	payload: unknown;
	from: string;
	timestamp: number;
}

// Constants
const COLORS = [
	"#EF4444", // red
	"#F59E0B", // amber
	"#10B981", // emerald
	"#3B82F6", // blue
	"#6366F1", // indigo
	"#8B5CF6", // violet
	"#EC4899", // pink
	"#14B8A6", // teal
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const generateRoomId = () => {
	return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface UseDesignerCollaborationOptions {
	getCanvasJson: () => string | null;
	applyRemoteOperation: (operation: CRDTOperation) => void;
	getLocalUserName?: () => string;
}

export const useDesignerCollaboration = (options: UseDesignerCollaborationOptions) => {
	// State
	const isConnected = ref(false);
	const isHost = ref(false);
	const roomId = ref<string | null>(null);
	const localUserId = ref(crypto.randomUUID());
	const localUserName = ref(options.getLocalUserName?.() || "Anonymous");
	const users = shallowRef<CollaborationUser[]>([]);
	const pendingOperations = ref<CRDTOperation[]>([]);
	const lastSyncTimestamp = ref<number>(0);

	// WebRTC connections
	const peerConnections = shallowRef<Map<string, RTCPeerConnection>>(new Map());
	const dataChannels = shallowRef<Map<string, RTCDataChannel>>(new Map());
	const signalingSocket = shallowRef<WebSocket | null>(null);

	// Computed
	const onlineUsers = computed(() => users.value.filter((u) => u.isOnline));
	const userCount = computed(() => onlineUsers.value.length);
	const canCollaborate = computed(() => isConnected.value && roomId.value !== null);

	// Helper functions
	const getOrCreateUser = (userId: string): CollaborationUser => {
		let user = users.value.find((u) => u.id === userId);
		if (!user) {
			user = {
				id: userId,
				name: `User ${userId.substring(0, 4)}`,
				color: getRandomColor(),
				cursor: null,
				selectedObjectId: null,
				isOnline: true,
				joinedAt: new Date(),
			};
			users.value = [...users.value, user];
		}
		return user;
	};

	const broadcastMessage = (message: WebRTCMessage) => {
		const messageStr = JSON.stringify(message);
		for (const [userId, channel] of dataChannels.value) {
			if (channel.readyState === "open") {
				try {
					channel.send(messageStr);
				} catch (err) {
					console.error(`[Collaboration] Failed to send to ${userId}:`, err);
				}
			}
		}
	};

	const handleIncomingMessage = (message: WebRTCMessage) => {
		switch (message.type) {
			case "cursor": {
				const payload = message.payload as { x: number; y: number };
				const user = getOrCreateUser(message.from);
				user.cursor = { x: payload.x, y: payload.y };
				users.value = [...users.value];
				break;
			}

			case "operation": {
				const operation = message.payload as CRDTOperation;
				// Apply operation if it's newer than our last sync
				if (operation.timestamp > lastSyncTimestamp.value) {
					options.applyRemoteOperation(operation);
					lastSyncTimestamp.value = operation.timestamp;
				}
				break;
			}

			case "user:join": {
				const payload = message.payload as { name: string; color: string };
				const user = getOrCreateUser(message.from);
				user.name = payload.name;
				user.color = payload.color;
				user.isOnline = true;
				users.value = [...users.value];

				// Send current state to new user if we're host
				if (isHost.value) {
					const currentState = options.getCanvasJson();
					if (currentState) {
						const syncMessage: WebRTCMessage = {
							type: "state:sync",
							payload: { canvasJson: currentState, timestamp: Date.now() },
							from: localUserId.value,
							timestamp: Date.now(),
						};
						const channel = dataChannels.value.get(message.from);
						if (channel?.readyState === "open") {
							channel.send(JSON.stringify(syncMessage));
						}
					}
				}
				break;
			}

			case "user:leave": {
				const user = users.value.find((u) => u.id === message.from);
				if (user) {
					user.isOnline = false;
					users.value = [...users.value];
				}
				break;
			}

			case "state:sync": {
				const payload = message.payload as { canvasJson: string; timestamp: number };
				if (!isHost.value && payload.timestamp > lastSyncTimestamp.value) {
					// Apply synced state
					lastSyncTimestamp.value = payload.timestamp;
				}
				break;
			}
		}
	};

	const createPeerConnection = (targetUserId: string): RTCPeerConnection => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "stun:stun1.l.google.com:19302" },
			],
		});

		pc.onicecandidate = (event) => {
			if (event.candidate && signalingSocket.value?.readyState === WebSocket.OPEN) {
				signalingSocket.value.send(
					JSON.stringify({
						type: "ice-candidate",
						target: targetUserId,
						candidate: event.candidate,
					}),
				);
			}
		};

		pc.ondatachannel = (event) => {
			const channel = event.channel;
			setupDataChannel(channel, targetUserId);
		};

		return pc;
	};

	const setupDataChannel = (channel: RTCDataChannel, userId: string) => {
		channel.onopen = () => {
			console.log(`[Collaboration] Data channel opened with ${userId}`);
			dataChannels.value.set(userId, channel);

			// Send join message
			const joinMessage: WebRTCMessage = {
				type: "user:join",
				payload: { name: localUserName.value, color: getRandomColor() },
				from: localUserId.value,
				timestamp: Date.now(),
			};
			channel.send(JSON.stringify(joinMessage));
		};

		channel.onmessage = (event) => {
			try {
				const message: WebRTCMessage = JSON.parse(event.data);
				handleIncomingMessage(message);
			} catch (err) {
				console.error("[Collaboration] Failed to parse message:", err);
			}
		};

		channel.onclose = () => {
			console.log(`[Collaboration] Data channel closed with ${userId}`);
			dataChannels.value.delete(userId);
			peerConnections.value.delete(userId);

			const user = users.value.find((u) => u.id === userId);
			if (user) {
				user.isOnline = false;
				users.value = [...users.value];
			}
		};
	};

	const handleSignalingMessage = async (data: Record<string, unknown>) => {
		switch (data.type) {
			case "user-joined": {
				const targetUserId = data.userId as string;
				if (targetUserId === localUserId.value) return;

				// Create peer connection as host
				const pc = createPeerConnection(targetUserId);
				peerConnections.value.set(targetUserId, pc);

				// Create data channel
				const channel = pc.createDataChannel("collaboration", {
					ordered: true,
				});
				setupDataChannel(channel, targetUserId);

				// Create and send offer
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);

				if (signalingSocket.value?.readyState === WebSocket.OPEN) {
					signalingSocket.value.send(
						JSON.stringify({
							type: "offer",
							target: targetUserId,
							offer,
						}),
					);
				}
				break;
			}

			case "offer": {
				const fromUserId = data.from as string;
				const offer = data.offer as RTCSessionDescriptionInit;

				// Create peer connection as guest
				const pc = createPeerConnection(fromUserId);
				peerConnections.value.set(fromUserId, pc);

				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);

				if (signalingSocket.value?.readyState === WebSocket.OPEN) {
					signalingSocket.value.send(
						JSON.stringify({
							type: "answer",
							target: fromUserId,
							answer,
						}),
					);
				}
				break;
			}

			case "answer": {
				const fromUserId = data.from as string;
				const pc = peerConnections.value.get(fromUserId);
				if (pc) {
					await pc.setRemoteDescription(new RTCSessionDescription(data.answer as RTCSessionDescriptionInit));
				}
				break;
			}

			case "ice-candidate": {
				const fromUserId = data.from as string;
				const pc = peerConnections.value.get(fromUserId);
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate as RTCIceCandidateInit));
				}
				break;
			}

			case "user-left": {
				const leftUserId = data.userId as string;
				const pc = peerConnections.value.get(leftUserId);
				if (pc) {
					pc.close();
					peerConnections.value.delete(leftUserId);
				}
				dataChannels.value.delete(leftUserId);

				const user = users.value.find((u) => u.id === leftUserId);
				if (user) {
					user.isOnline = false;
					users.value = [...users.value];
				}
				break;
			}
		}
	};

	// Public methods
	const createRoom = async (userName?: string): Promise<string> => {
		if (userName) {
			localUserName.value = userName;
		}

		const newRoomId = generateRoomId();
		roomId.value = newRoomId;
		isHost.value = true;
		isConnected.value = true;

		// Connect to signaling server
		const wsUrl = `wss://signaling.example.com/${newRoomId}`;
		// Note: In production, replace with actual signaling server
		// For now, we'll use a mock implementation

		console.log(`[Collaboration] Created room: ${newRoomId}`);

		// Add local user
		const localUser: CollaborationUser = {
			id: localUserId.value,
			name: localUserName.value,
			color: getRandomColor(),
			cursor: null,
			selectedObjectId: null,
			isOnline: true,
			joinedAt: new Date(),
		};
		users.value = [localUser];

		return newRoomId;
	};

	const joinRoom = async (id: string, userName?: string): Promise<boolean> => {
		if (userName) {
			localUserName.value = userName;
		}

		roomId.value = id;
		isHost.value = false;
		isConnected.value = true;

		// Connect to signaling server
		console.log(`[Collaboration] Joined room: ${id}`);

		// Add local user
		const localUser: CollaborationUser = {
			id: localUserId.value,
			name: localUserName.value,
			color: getRandomColor(),
			cursor: null,
			selectedObjectId: null,
			isOnline: true,
			joinedAt: new Date(),
		};
		users.value = [localUser];

		return true;
	};

	const leaveRoom = () => {
		// Close all peer connections
		for (const [userId, pc] of peerConnections.value) {
			// Send leave message
			const leaveMessage: WebRTCMessage = {
				type: "user:leave",
				payload: {},
				from: localUserId.value,
				timestamp: Date.now(),
			};
			const channel = dataChannels.value.get(userId);
			if (channel?.readyState === "open") {
				channel.send(JSON.stringify(leaveMessage));
			}

			pc.close();
		}

		// Close signaling socket
		signalingSocket.value?.close();

		// Reset state
		peerConnections.value = new Map();
		dataChannels.value = new Map();
		signalingSocket.value = null;
		users.value = [];
		roomId.value = null;
		isHost.value = false;
		isConnected.value = false;
	};

	const updateCursor = (x: number, y: number) => {
		if (!isConnected.value) return;

		const message: WebRTCMessage = {
			type: "cursor",
			payload: { x, y },
			from: localUserId.value,
			timestamp: Date.now(),
		};

		broadcastMessage(message);
	};

	const broadcastOperation = (operation: CRDTOperation) => {
		if (!isConnected.value) return;

		const message: WebRTCMessage = {
			type: "operation",
			payload: operation,
			from: localUserId.value,
			timestamp: Date.now(),
		};

		broadcastMessage(message);

		// Also add to pending operations for conflict resolution
		pendingOperations.value.push(operation);
	};

	const setLocalUserName = (name: string) => {
		localUserName.value = name;
	};

	const getRoomLink = (): string | null => {
		if (!roomId.value) return null;
		return `${window.location.origin}/design?room=${roomId.value}`;
	};

	const dispose = () => {
		leaveRoom();
	};

	return {
		// State
		isConnected,
		isHost,
		roomId,
		localUserId,
		localUserName: computed(() => localUserName.value),
		users,
		onlineUsers,
		userCount,
		canCollaborate,
		pendingOperations,

		// Actions
		createRoom,
		joinRoom,
		leaveRoom,
		updateCursor,
		broadcastOperation,
		setLocalUserName,
		getRoomLink,
		dispose,
	};
};
