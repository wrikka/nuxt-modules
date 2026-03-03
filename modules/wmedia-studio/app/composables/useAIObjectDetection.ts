export interface DetectedObject {
	id: string;
	label: string;
	confidence: number;
	bbox: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	mask?: string;
}

export interface ObjectDetectionResult {
	id: string;
	imageUrl: string;
	objects: DetectedObject[];
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
	createdAt: Date;
}

export function useAIObjectDetection() {
	const isDetecting = ref(false);
	const progress = ref(0);
	const currentResult = ref<ObjectDetectionResult | null>(null);
	const results = ref<ObjectDetectionResult[]>([]);

	const detectObjects = async (imageUrl: string): Promise<ObjectDetectionResult | null> => {
		isDetecting.value = true;
		progress.value = 0;
		currentResult.value = null;

		try {
			const response = await $fetch<{ result: ObjectDetectionResult }>("/api/ai/object-detection", {
				method: "POST",
				body: { imageUrl },
			});

			currentResult.value = response.result;
			results.value.push(response.result);
			progress.value = 100;

			return response.result;
		} catch (error) {
			console.error("Failed to detect objects:", error);
			return null;
		} finally {
			isDetecting.value = false;
		}
	};

	const segmentImage = async (imageUrl: string, objectLabel: string): Promise<ObjectDetectionResult | null> => {
		try {
			const response = await $fetch<{ result: ObjectDetectionResult }>("/api/ai/segmentation", {
				method: "POST",
				body: { imageUrl, objectLabel },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to segment image:", error);
			return null;
		}
	};

	const detectText = async (imageUrl: string): Promise<ObjectDetectionResult | null> => {
		try {
			const response = await $fetch<{ result: ObjectDetectionResult }>("/api/ai/text-detection", {
				method: "POST",
				body: { imageUrl },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to detect text:", error);
			return null;
		}
	};

	const detectFaces = async (imageUrl: string): Promise<ObjectDetectionResult | null> => {
		try {
			const response = await $fetch<{ result: ObjectDetectionResult }>("/api/ai/face-detection", {
				method: "POST",
				body: { imageUrl },
			});

			results.value.push(response.result);
			return response.result;
		} catch (error) {
			console.error("Failed to detect faces:", error);
			return null;
		}
	};

	const getObjectByLabel = (resultId: string, label: string): DetectedObject | undefined => {
		const result = results.value.find(r => r.id === resultId);
		return result?.objects.find(o => o.label === label);
	};

	const getObjectsByLabel = (resultId: string, label: string): DetectedObject[] => {
		const result = results.value.find(r => r.id === resultId);
		return result?.objects.filter(o => o.label === label) || [];
	};

	const getHighConfidenceObjects = (resultId: string, threshold: number = 0.8): DetectedObject[] => {
		const result = results.value.find(r => r.id === resultId);
		return result?.objects.filter(o => o.confidence >= threshold) || [];
	};

	const getDetectionHistory = async () => {
		try {
			const data = await $fetch<{ results: ObjectDetectionResult[] }>("/api/ai/object-detection/history");
			results.value = data.results || [];
		} catch (error) {
			console.error("Failed to load detection history:", error);
		}
	};

	const deleteResult = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/object-detection/${resultId}`, {
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
		isDetecting,
		progress,
		currentResult,
		results,
		detectObjects,
		segmentImage,
		detectText,
		detectFaces,
		getObjectByLabel,
		getObjectsByLabel,
		getHighConfidenceObjects,
		getDetectionHistory,
		deleteResult,
	};
}
