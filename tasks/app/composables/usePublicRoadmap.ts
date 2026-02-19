import { readonly, ref } from "vue"

export function usePublicRoadmap() {
	const shareUrl = ref<string | null>(null)
	const isPublic = ref(false)
	const viewCount = ref(0)

	async function generateShareLink(projectId: string, options: {
		allowComments?: boolean
		hideCompleted?: boolean
		dateRange?: { start: string, end: string }
	} = {}): Promise<string> {
		// Generate a unique share token
		const token = btoa(`${projectId}:${Date.now()}`).replace(/[^a-zA-Z0-9]/g, "")
		const baseUrl = window.location.origin
		shareUrl.value = `${baseUrl}/roadmap/${token}`
		isPublic.value = true

		// Store settings
		await $fetch(`/api/roadmap/${projectId}/share`, {
			method: "POST",
			body: { token, options },
		})

		return shareUrl.value
	}

	async function revokeShareLink(projectId: string): Promise<void> {
		await $fetch(`/api/roadmap/${projectId}/share`, {
			method: "DELETE",
		})
		shareUrl.value = null
		isPublic.value = false
	}

	async function getShareStats(projectId: string): Promise<{ views: number, lastViewed: string | null }> {
		return await $fetch(`/api/roadmap/${projectId}/stats`)
	}

	function copyToClipboard(): void {
		if (shareUrl.value) {
			navigator.clipboard.writeText(shareUrl.value)
		}
	}

	return {
		shareUrl: readonly(shareUrl),
		isPublic: readonly(isPublic),
		viewCount: readonly(viewCount),
		generateShareLink,
		revokeShareLink,
		getShareStats,
		copyToClipboard,
	}
}
