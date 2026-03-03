import type { AudioClip, AudioMarker, AudioRegion, AudioTrack } from "#shared/types/audio";
import { io, Socket } from "socket.io-client";

export interface CollaborationUser {
	id: string;
	name: string;
	color: string;
	cursorPosition?: { trackId: string | null; time: number };
	isConnected: boolean;
}

export const useAudioCollaboration = (roomId: string, userId: string, userName: string) => {
	const socket = ref<Socket | null>(null);
	const isConnected = ref(false);
	const users = ref<CollaborationUser[]>([]);
	const currentUser = ref<CollaborationUser | null>(null);

	const connect = () => {
		const wsUrl = useRuntimeConfig().public.wsUrl || "ws://localhost:3000";
		socket.value = io(wsUrl, {
			query: { roomId, userId, userName },
		});

		socket.value.on("connect", () => {
			isConnected.value = true;
			console.log("Connected to collaboration server");
		});

		socket.value.on("disconnect", () => {
			isConnected.value = false;
			console.log("Disconnected from collaboration server");
		});

		socket.value.on("users", (connectedUsers: CollaborationUser[]) => {
			users.value = connectedUsers;
			currentUser.value = connectedUsers.find((u) => u.id === userId) || null;
		});

		socket.value.on("user-joined", (user: CollaborationUser) => {
			users.value.push(user);
		});

		socket.value.on("user-left", (userId: string) => {
			users.value = users.value.filter((u) => u.id !== userId);
		});

		socket.value.on(
			"cursor-move",
			(data: { userId: string; cursorPosition: { trackId: string | null; time: number } }) => {
				const user = users.value.find((u) => u.id === data.userId);
				if (user) {
					user.cursorPosition = data.cursorPosition;
				}
			},
		);

		socket.value.on("track-added", (_track: AudioTrack) => {
			// Handle track added by another user
		});

		socket.value.on("clip-added", (_data: { clip: AudioClip; trackId: string }) => {
			// Handle clip added by another user
		});

		socket.value.on("clip-updated", (_data: { clipId: string; updates: Partial<AudioClip> }) => {
			// Handle clip updated by another user
		});

		socket.value.on("clip-removed", (_data: { clipId: string; trackId: string }) => {
			// Handle clip removed by another user
		});

		socket.value.on("marker-added", (_marker: AudioMarker) => {
			// Handle marker added by another user
		});

		socket.value.on("marker-removed", (_markerId: string) => {
			// Handle marker removed by another user
		});

		socket.value.on("region-added", (_region: AudioRegion) => {
			// Handle region added by another user
		});

		socket.value.on("region-removed", (_regionId: string) => {
			// Handle region removed by another user
		});
	};

	const disconnect = () => {
		if (socket.value) {
			socket.value.disconnect();
			socket.value = null;
			isConnected.value = false;
		}
	};

	const emitCursorMove = (trackId: string | null, time: number) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("cursor-move", { userId, cursorPosition: { trackId, time } });
		}
	};

	const emitTrackAdded = (track: AudioTrack) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("track-added", track);
		}
	};

	const emitClipAdded = (clip: AudioClip, trackId: string) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("clip-added", { clip, trackId });
		}
	};

	const emitClipUpdated = (clipId: string, updates: Partial<AudioClip>) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("clip-updated", { clipId, updates });
		}
	};

	const emitClipRemoved = (clipId: string, trackId: string) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("clip-removed", { clipId, trackId });
		}
	};

	const emitMarkerAdded = (marker: AudioMarker) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("marker-added", marker);
		}
	};

	const emitMarkerRemoved = (markerId: string) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("marker-removed", markerId);
		}
	};

	const emitRegionAdded = (region: AudioRegion) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("region-added", region);
		}
	};

	const emitRegionRemoved = (regionId: string) => {
		if (socket.value && isConnected.value) {
			socket.value.emit("region-removed", regionId);
		}
	};

	onMounted(() => {
		connect();
	});

	onUnmounted(() => {
		disconnect();
	});

	return {
		socket,
		isConnected,
		users,
		currentUser,
		connect,
		disconnect,
		emitCursorMove,
		emitTrackAdded,
		emitClipAdded,
		emitClipUpdated,
		emitClipRemoved,
		emitMarkerAdded,
		emitMarkerRemoved,
		emitRegionAdded,
		emitRegionRemoved,
	};
};
