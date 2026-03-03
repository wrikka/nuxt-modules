import type { PresenceUpdate, UserPresence } from "../shared/types/presence"

export const useWorkOSPresence = () => {
	const updatePresence = async (update: PresenceUpdate): Promise<void> => {
		try {
			await $fetch("/api/workos/presence", {
				method: "POST",
				body: update,
			})
		} catch (error) {
			console.error("Failed to update presence:", error)
		}
	}

	const getUserPresence = async (userId: string): Promise<UserPresence | null> => {
		try {
			return await $fetch<UserPresence>(`/api/workos/presence/${userId}`)
		} catch {
			return null
		}
	}

	const getOrganizationPresence = async (organizationId: string): Promise<UserPresence[]> => {
		return await $fetch<UserPresence[]>(`/api/workos/presence/organization/${organizationId}`)
	}

	const getOnlineUsers = async (organizationId?: string): Promise<UserPresence[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch<UserPresence[]>(`/api/workos/presence/online${query}`)
	}

	const subscribeToPresence = (callback: (presences: UserPresence[]) => void) => {
		if (process.client) {
			const eventSource = new EventSource("/api/workos/presence/stream")

			eventSource.onmessage = (event) => {
				const presences = JSON.parse(event.data)
				callback(presences)
			}

			eventSource.onerror = () => {
				eventSource.close()
			}

			return () => eventSource.close()
		}
		return () => {}
	}

	return {
		updatePresence,
		getUserPresence,
		getOrganizationPresence,
		getOnlineUsers,
		subscribeToPresence,
	}
}
