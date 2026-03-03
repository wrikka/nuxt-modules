import { computed, onUnmounted, ref } from "vue";

export interface UserPresence {
	userId: string;
	userName: string;
	userColor: string;
	avatar?: string;
	status: "online" | "away" | "offline" | "busy";
	lastSeen: Date;
	currentProjectId?: string;
	currentActivity?: string;
}

export function useUserPresence(userId: Ref<string>) {
	const presences = ref<Map<string, UserPresence>>(new Map());
	const myPresence = ref<UserPresence | null>(null);
	const heartbeatInterval = ref<NodeJS.Timeout | null>(null);

	const onlineUsers = computed(() => {
		return Array.from(presences.value.values()).filter(p => p.status === "online");
	});

	const getUserPresence = (userId: string) => {
		return presences.value.get(userId);
	};

	const updateMyPresence = async (
		status: UserPresence["status"],
		currentProjectId?: string,
		currentActivity?: string,
	) => {
		try {
			const result = await $fetch<{ presence: UserPresence }>(`/api/users/${userId.value}/presence`, {
				method: "PATCH",
				body: { status, currentProjectId, currentActivity },
			});

			myPresence.value = result.presence;
			return true;
		} catch (error) {
			console.error("Failed to update presence:", error);
			return false;
		}
	};

	const loadPresences = async () => {
		try {
			const data = await $fetch<{ presences: UserPresence[] }>(`/api/presences`);
			data.presences.forEach(presence => {
				presences.value.set(presence.userId, presence);
			});

			myPresence.value = presences.value.get(userId.value) || null;
		} catch (error) {
			console.error("Failed to load presences:", error);
		}
	};

	const startHeartbeat = () => {
		stopHeartbeat();
		heartbeatInterval.value = setInterval(async () => {
			await updateMyPresence("online");
		}, 30000);
	};

	const stopHeartbeat = () => {
		if (heartbeatInterval.value) {
			clearInterval(heartbeatInterval.value);
			heartbeatInterval.value = null;
		}
	};

	const setAway = async () => {
		await updateMyPresence("away");
	};

	const setOnline = async () => {
		await updateMyPresence("online");
	};

	const setBusy = async () => {
		await updateMyPresence("busy");
	};

	const setOffline = async () => {
		await updateMyPresence("offline");
		stopHeartbeat();
	};

	const cleanupStalePresences = () => {
		const now = new Date();
		const staleThreshold = 5 * 60 * 1000;

		for (const [userId, presence] of presences.value) {
			if (now.getTime() - presence.lastSeen.getTime() > staleThreshold) {
				presences.value.delete(userId);
			}
		}
	};

	const cleanupInterval = setInterval(cleanupStalePresences, 60000);

	onUnmounted(() => {
		clearInterval(cleanupInterval);
		stopHeartbeat();
	});

	return {
		presences,
		myPresence,
		onlineUsers,
		getUserPresence,
		updateMyPresence,
		loadPresences,
		startHeartbeat,
		stopHeartbeat,
		setAway,
		setOnline,
		setBusy,
		setOffline,
	};
}
