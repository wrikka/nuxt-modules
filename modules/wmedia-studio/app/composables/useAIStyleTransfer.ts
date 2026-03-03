export interface StyleTransferRequest {
	contentImageUrl: string;
	styleImageUrl: string;
	strength?: number;
	preserveColor?: boolean;
}

export interface StyleTransferResult {
	id: string;
	contentImageUrl: string;
	styleImageUrl: string;
	resultImageUrl: string;
	thumbnailUrl: string;
	strength: number;
	preserveColor: boolean;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
	createdAt: Date;
}

export function useAIStyleTransfer() {
	const isProcessing = ref(false);
	const progress = ref(0);
	const currentResult = ref<StyleTransferResult | null>(null);
	const results = ref<StyleTransferResult[]>([]);

	const transferStyle = async (request: StyleTransferRequest): Promise<StyleTransferResult | null> => {
		isProcessing.value = true;
		progress.value = 0;
		currentResult.value = null;

		try {
			const response = await $fetch<{ result: StyleTransferResult }>("/api/ai/style-transfer", {
				method: "POST",
				body: request,
			});

			currentResult.value = response.result;
			results.value.push(response.result);
			progress.value = 100;

			return response.result;
		} catch (error) {
			console.error("Failed to transfer style:", error);
			return null;
		} finally {
			isProcessing.value = false;
		}
	};

	const applyPresetStyle = async (
		contentImageUrl: string,
		presetStyle: string,
	): Promise<StyleTransferResult | null> => {
		try {
			const response = await $fetch<{ result: StyleTransferResult }>("/api/ai/style-transfer/preset", {
				method: "POST",
				body: { contentImageUrl, presetStyle },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to apply preset style:", error);
			return null;
		}
	};

	const cancelProcessing = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/style-transfer/${resultId}/cancel`, {
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

	const downloadResult = (result: StyleTransferResult) => {
		const link = document.createElement("a");
		link.href = result.resultImageUrl;
		link.download = `style-transfer-${result.id}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const addToCanvas = async (result: StyleTransferResult) => {
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
			const data = await $fetch<{ results: StyleTransferResult[] }>("/api/ai/style-transfer/history");
			results.value = data.results || [];
		} catch (error) {
			console.error("Failed to load processing history:", error);
		}
	};

	const deleteResult = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/style-transfer/${resultId}`, {
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
		transferStyle,
		applyPresetStyle,
		cancelProcessing,
		downloadResult,
		addToCanvas,
		getProcessingHistory,
		deleteResult,
	};
}
