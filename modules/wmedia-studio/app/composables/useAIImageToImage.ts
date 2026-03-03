export interface ImageToImageRequest {
	sourceImageUrl: string;
	prompt: string;
	negativePrompt?: string;
	strength?: number;
	guidanceScale?: number;
	seed?: number;
}

export interface ImageToImageResult {
	id: string;
	sourceImageUrl: string;
	resultImageUrl: string;
	thumbnailUrl: string;
	prompt: string;
	negativePrompt?: string;
	strength: number;
	guidanceScale: number;
	seed?: number;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
	createdAt: Date;
}

export function useAIImageToImage() {
	const isProcessing = ref(false);
	const progress = ref(0);
	const currentResult = ref<ImageToImageResult | null>(null);
	const results = ref<ImageToImageResult[]>([]);

	const processImage = async (request: ImageToImageRequest): Promise<ImageToImageResult | null> => {
		isProcessing.value = true;
		progress.value = 0;
		currentResult.value = null;

		try {
			const response = await $fetch<{ result: ImageToImageResult }>("/api/ai/image-to-image", {
				method: "POST",
				body: request,
			});

			currentResult.value = response.result;
			results.value.push(response.result);
			progress.value = 100;

			return response.result;
		} catch (error) {
			console.error("Failed to process image:", error);
			return null;
		} finally {
			isProcessing.value = false;
		}
	};

	const upscaleImage = async (imageUrl: string, _scale: number = 2): Promise<ImageToImageResult | null> => {
		return processImage({
			sourceImageUrl: imageUrl,
			prompt: "high quality, detailed, sharp",
			strength: 0.3,
		});
	};

	const removeBackground = async (imageUrl: string): Promise<ImageToImageResult | null> => {
		try {
			const response = await $fetch<{ result: ImageToImageResult }>("/api/ai/remove-background", {
				method: "POST",
				body: { imageUrl },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to remove background:", error);
			return null;
		}
	};

	const inpaintImage = async (
		imageUrl: string,
		maskImageUrl: string,
		prompt: string,
	): Promise<ImageToImageResult | null> => {
		try {
			const response = await $fetch<{ result: ImageToImageResult }>("/api/ai/inpaint", {
				method: "POST",
				body: { imageUrl, maskImageUrl, prompt },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to inpaint image:", error);
			return null;
		}
	};

	const outpaintImage = async (
		imageUrl: string,
		direction: "left" | "right" | "top" | "bottom",
		prompt: string,
	): Promise<ImageToImageResult | null> => {
		try {
			const response = await $fetch<{ result: ImageToImageResult }>("/api/ai/outpaint", {
				method: "POST",
				body: { imageUrl, direction, prompt },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to outpaint image:", error);
			return null;
		}
	};

	const cancelProcessing = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/image-to-image/${resultId}/cancel`, {
				method: "POST",
			});

			const result = results.value.find(r => r.id === resultId);
			if (result) {
				result.status = "failed";
				result.error = "Cancelled by user";
			}

			return true;
		} catch (error) {
			console.error("Failed to cancel processing:", error);
			return false;
		}
	};

	const downloadResult = (result: ImageToImageResult) => {
		const link = document.createElement("a");
		link.href = result.resultImageUrl;
		link.download = `ai-processed-${result.id}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const addToCanvas = async (result: ImageToImageResult) => {
		try {
			const response = await fetch(result.resultImageUrl);
			const blob = await response.blob();
			return blob;
		} catch (error) {
			console.error("Failed to add image to canvas:", error);
			return null;
		}
	};

	const getProcessingHistory = async () => {
		try {
			const data = await $fetch<{ results: ImageToImageResult[] }>("/api/ai/image-to-image/history");
			results.value = data.results || [];
		} catch (error) {
			console.error("Failed to load processing history:", error);
		}
	};

	const deleteResult = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/image-to-image/${resultId}`, {
				method: "DELETE",
			});

			results.value = results.value.filter(r => r.id !== resultId);
			return true;
		} catch (error) {
			console.error("Failed to delete result:", error);
			return false;
		}
	};

	return {
		isProcessing,
		progress,
		currentResult,
		results,
		processImage,
		upscaleImage,
		removeBackground,
		inpaintImage,
		outpaintImage,
		cancelProcessing,
		downloadResult,
		addToCanvas,
		getProcessingHistory,
		deleteResult,
	};
}
