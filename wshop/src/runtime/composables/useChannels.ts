import { useFetch } from "#imports"
import type { Channel } from "~~/shared/types"

export const useChannels = () => {
	const { data: connectedChannels, refresh } = useFetch<Channel[]>("/api/channels")

	const connectChannel = async (channelId: string) => {
		try {
			await $fetch("/api/channels", {
				method: "POST",
				body: { id: channelId, type: channelId, enabled: true },
			})
			await refresh()
		} catch (error) {
			console.error("Failed to connect channel:", error)
			throw error
		}
	}

	const toggleChannel = async (channelId: string, currentStatus: boolean) => {
		try {
			await $fetch(`/api/channels/${channelId}`, {
				method: "PUT",
				body: { enabled: !currentStatus },
			})
			await refresh()
		} catch (error) {
			console.error("Failed to toggle channel:", error)
			throw error
		}
	}

	const saveConfig = async (channelId: string, config: Record<string, unknown>) => {
		try {
			await $fetch(`/api/channels/${channelId}`, {
				method: "PUT",
				body: { config },
			})
			await refresh()
		} catch (error) {
			console.error("Failed to save config:", error)
			throw error
		}
	}

	return {
		connectedChannels,
		refresh,
		connectChannel,
		toggleChannel,
		saveConfig,
	}
}
