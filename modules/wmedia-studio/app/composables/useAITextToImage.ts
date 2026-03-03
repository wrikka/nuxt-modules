export interface TextToImageRequest {
	prompt: string;
	negativePrompt?: string;
	width: number;
	height: number;
	style?: string;
	quality?: "low" | "medium" | "high";
	seed?: number;
}

export interface TextToImageResult {
	id: string;
	imageUrl: string;
	thumbnailUrl: string;
	prompt: string;
	negativePrompt?: string;
	width: number;
	height: number;
	style?: string;
	seed?: number;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
	createdAt: Date;
}

export function useAITextToImage() {
	const isGenerating = ref(false);
	const progress = ref(0);
	const currentResult = ref<TextToImageResult | null>(null);
	const results = ref<TextToImageResult[]>([]);

	const generateImage = async (request: TextToImageRequest): Promise<TextToImageResult | null> => {
		isGenerating.value = true;
		progress.value = 0;
		currentResult.value = null;

		try {
			const response = await $fetch<{ result: TextToImageResult }>("/api/ai/text-to-image", {
				method: "POST",
				body: request,
			});

			currentResult.value = response.result;
			results.value.push(response.result);
			progress.value = 100;

			return response.result;
		} catch (error) {
			console.error("Failed to generate image:", error);
			return null;
		} finally {
			isGenerating.value = false;
		}
	};

	const generateMultipleImages = async (requests: TextToImageRequest[]): Promise<TextToImageResult[]> => {
		const promises = requests.map(request => generateImage(request));
		const results = await Promise.all(promises);
		return results.filter(Boolean) as TextToImageResult[];
	};

	const cancelGeneration = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/text-to-image/${resultId}/cancel`, {
				method: "POST",
			});

			const result = results.value.find(r => r.id === resultId);
			if (result) {
				result.status = "failed";
				result.error = "Cancelled by user";
			}

			return true;
		} catch (error) {
			console.error("Failed to cancel generation:", error);
			return false;
		}
	};

	const downloadImage = (result: TextToImageResult) => {
		const link = document.createElement("a");
		link.href = result.imageUrl;
		link.download = `ai-image-${result.id}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const addToCanvas = async (result: TextToImageResult) => {
		try {
			const response = await fetch(result.imageUrl);
			const blob = await response.blob();
			return blob;
		} catch (error) {
			console.error("Failed to add image to canvas:", error);
			return null;
		}
	};

	const getGenerationHistory = async () => {
		try {
			const data = await $fetch<{ results: TextToImageResult[] }>("/api/ai/text-to-image/history");
			results.value = data.results || [];
		} catch (error) {
			console.error("Failed to load generation history:", error);
		}
	};

	const deleteResult = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/text-to-image/${resultId}`, {
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
		isGenerating,
		progress,
		currentResult,
		results,
		generateImage,
		generateMultipleImages,
		cancelGeneration,
		downloadImage,
		addToCanvas,
		getGenerationHistory,
		deleteResult,
	};
}
