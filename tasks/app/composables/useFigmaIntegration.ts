import type { FigmaFile, FigmaFrame } from "../../shared/types/integration"
import { readonly, ref } from "vue"

export function useFigmaIntegration() {
	const linkedFiles = ref<FigmaFile[]>([])
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	async function linkFigmaFile(fileUrl: string, token: string): Promise<FigmaFile> {
		isLoading.value = true
		try {
			const fileId = extractFileId(fileUrl)
			const response = await $fetch<FigmaFile>(`/api/integrations/figma/link`, {
				method: "POST",
				body: { fileId, token },
			})
			linkedFiles.value.push(response)
			return response
		}
		catch (e) {
			error.value = e as Error
			throw e
		}
		finally {
			isLoading.value = false
		}
	}

	async function unlinkFigmaFile(fileId: string): Promise<void> {
		await $fetch(`/api/integrations/figma/unlink`, {
			method: "POST",
			body: { fileId },
		})
		linkedFiles.value = linkedFiles.value.filter(f => f.id !== fileId)
	}

	async function fetchFileFrames(fileId: string): Promise<FigmaFrame[]> {
		return await $fetch<FigmaFrame[]>(`/api/integrations/figma/${fileId}/frames`)
	}

	async function linkFrameToTask(taskId: string, frameId: string, fileId: string): Promise<void> {
		await $fetch(`/api/integrations/figma/link-frame`, {
			method: "POST",
			body: { taskId, frameId, fileId },
		})
	}

	function extractFileId(url: string): string {
		const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/)
		if (!match) {
			throw new Error("Invalid Figma URL")
		}
		return match[1]
	}

	function getEmbedUrl(fileId: string, frameId?: string): string {
		const base = `https://www.figma.com/embed?embed_host=tasks&url=https://www.figma.com/file/${fileId}`
		return frameId ? `${base}?node-id=${encodeURIComponent(frameId)}` : base
	}

	function getThumbnailUrl(fileId: string): string {
		return `https://www.figma.com/file/${fileId}/thumbnail`
	}

	return {
		linkedFiles: readonly(linkedFiles),
		isLoading: readonly(isLoading),
		error: readonly(error),
		linkFigmaFile,
		unlinkFigmaFile,
		fetchFileFrames,
		linkFrameToTask,
		extractFileId,
		getEmbedUrl,
		getThumbnailUrl,
	}
}
