import { useFetch } from "#imports"
import type { Segment } from "#shared/types"

export const useSegments = () => {
	const { data: segments, pending, error, refresh } = useFetch<Segment[]>("/api/segments")

	const deleteSegment = async (segmentId: string) => {
		try {
			await $fetch(`/api/segments/${segmentId}`, { method: "DELETE" })
			await refresh()
			// In a real app, show a success toast notification
		} catch (err) {
			console.error("Failed to delete segment:", err)
			// In a real app, show an error toast notification
			throw err // Re-throw to allow the component to handle it if needed
		}
	}

	return {
		segments,
		pending,
		error,
		refresh,
		deleteSegment,
	}
}
