import { readonly, ref } from "vue"

export function useTaskScreenshot() {
	const isProcessing = ref(false)
	const extractedText = ref("")
	const generatedTasks = ref<Array<{ title: string, description: string }>>([])

	async function captureAndProcess(): Promise<void> {
		try {
			// Request screen capture permission
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: { cursor: "always" },
			})

			const video = document.createElement("video")
			video.srcObject = stream
			await video.play()

			// Capture frame
			const canvas = document.createElement("canvas")
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			const ctx = canvas.getContext("2d")
			ctx?.drawImage(video, 0, 0)

			// Stop stream
			stream.getTracks().forEach(track => track.stop())

			// Convert to blob
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((b) => resolve(b!), "image/png")
			})

			await processImage(blob)
		}
		catch (e) {
			console.error("Screen capture failed:", e)
		}
	}

	async function uploadAndProcess(file: File): Promise<void> {
		isProcessing.value = true
		try {
			const formData = new FormData()
			formData.append("image", file)

			const result = await $fetch<{
				text: string
				tasks: Array<{ title: string, description: string }>
			}>("/api/ai/screenshot-to-task", {
				method: "POST",
				body: formData,
			})

			extractedText.value = result.text
			generatedTasks.value = result.tasks
		}
		finally {
			isProcessing.value = false
		}
	}

	async function processImage(imageBlob: Blob): Promise<void> {
		const file = new File([imageBlob], "screenshot.png", { type: "image/png" })
		await uploadAndProcess(file)
	}

	function clear(): void {
		extractedText.value = ""
		generatedTasks.value = []
	}

	return {
		isProcessing: readonly(isProcessing),
		extractedText: readonly(extractedText),
		generatedTasks: readonly(generatedTasks),
		captureAndProcess,
		uploadAndProcess,
		processImage,
		clear,
	}
}
