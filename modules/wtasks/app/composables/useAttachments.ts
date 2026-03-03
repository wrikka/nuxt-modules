import type { Attachment } from "~/shared/types/features"

/**
 * Composable for Document Attachments
 */
export const useAttachments = () => {
	const { $toast } = useNuxtApp()

	const attachments = useState<Attachment[]>("attachments", () => [])
	const isUploading = useState<boolean>("uploading", () => false)
	const uploadProgress = useState<number>("upload-progress", () => 0)

	/**
	 * Fetch attachments for task
	 */
	const fetchAttachments = async (taskId: string) => {
		const { data } = await useFetch<Attachment[]>(`/api/tasks/${taskId}/attachments`)
		if (data.value) attachments.value = data.value
	}

	/**
	 * Upload file
	 */
	const uploadFile = async (taskId: string, file: File) => {
		isUploading.value = true
		uploadProgress.value = 0

		const formData = new FormData()
		formData.append("file", file)

		try {
			const { data, error } = await useFetch<Attachment>(`/api/tasks/${taskId}/attachments`, {
				method: "POST",
				body: formData,
			})

			if (error.value || !data.value) {
				$toast.error("Failed to upload file")
				return null
			}

			attachments.value.push(data.value)
			$toast.success("File uploaded")
			return data.value
		} finally {
			isUploading.value = false
			uploadProgress.value = 0
		}
	}

	/**
	 * Upload multiple files
	 */
	const uploadMultiple = async (taskId: string, files: File[]) => {
		const uploaded: Attachment[] = []

		for (const file of files) {
			const result = await uploadFile(taskId, file)
			if (result) uploaded.push(result)
		}

		return uploaded
	}

	/**
	 * Delete attachment
	 */
	const deleteAttachment = async (attachmentId: string) => {
		const { error } = await useFetch(`/api/attachments/${attachmentId}`, { method: "DELETE" })

		if (error.value) {
			$toast.error("Failed to delete attachment")
			return false
		}

		attachments.value = attachments.value.filter(a => a.id !== attachmentId)
		$toast.success("Attachment deleted")
		return true
	}

	/**
	 * Get file icon based on mime type
	 */
	const getFileIcon = (mimeType: string): string => {
		if (mimeType.startsWith("image/")) return "mdi:file-image"
		if (mimeType.includes("pdf")) return "mdi:file-pdf"
		if (mimeType.includes("word") || mimeType.includes("document")) return "mdi:file-word"
		if (mimeType.includes("excel") || mimeType.includes("sheet")) return "mdi:file-excel"
		if (mimeType.includes("video")) return "mdi:file-video"
		if (mimeType.includes("audio")) return "mdi:file-music"
		return "mdi:file-document"
	}

	/**
	 * Format file size
	 */
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 B"
		const k = 1024
		const sizes = ["B", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
	}

	/**
	 * Download attachment
	 */
	const downloadAttachment = (attachment: Attachment) => {
		const link = document.createElement("a")
		link.href = attachment.url
		link.download = attachment.name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return {
		attachments: readonly(attachments),
		isUploading,
		uploadProgress,
		fetchAttachments,
		uploadFile,
		uploadMultiple,
		deleteAttachment,
		getFileIcon,
		formatFileSize,
		downloadAttachment,
	}
}
