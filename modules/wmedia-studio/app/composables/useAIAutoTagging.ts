export interface AutoTagResult {
	id: string;
	imageUrl: string;
	tags: string[];
	categories: string[];
	confidence: number;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
	createdAt: Date;
}

export function useAIAutoTagging() {
	const isTagging = ref(false);
	const progress = ref(0);
	const currentResult = ref<AutoTagResult | null>(null);
	const results = ref<AutoTagResult[]>([]);

	const generateTags = async (imageUrl: string): Promise<AutoTagResult | null> => {
		isTagging.value = true;
		progress.value = 0;
		currentResult.value = null;

		try {
			const response = await $fetch<{ result: AutoTagResult }>("/api/ai/auto-tag", {
				method: "POST",
				body: { imageUrl },
			});

			currentResult.value = response.result;
			results.value.push(response.result);
			progress.value = 100;

			return response.result;
		} catch (error) {
			console.error("Failed to generate tags:", error);
			return null;
		} finally {
			isTagging.value = false;
		}
	};

	const batchTagImages = async (imageUrls: string[]): Promise<AutoTagResult[]> => {
		const promises = imageUrls.map(url => generateTags(url));
		const results = await Promise.all(promises);
		return results.filter(Boolean) as AutoTagResult[];
	};

	const suggestTags = async (context: string): Promise<string[]> => {
		try {
			const data = await $fetch<{ tags: string[] }>("/api/ai/suggest-tags", {
				method: "POST",
				body: { context },
			});
			return data.tags || [];
		} catch (error) {
			console.error("Failed to suggest tags:", error);
			return [];
		}
	};

	const getTaggingHistory = async () => {
		try {
			const data = await $fetch<{ results: AutoTagResult[] }>("/api/ai/auto-tag/history");
			results.value = data.results || [];
		} catch (error) {
			console.error("Failed to load tagging history:", error);
		}
	};

	const deleteResult = async (resultId: string) => {
		try {
			await $fetch(`/api/ai/auto-tag/${resultId}`);

			results.value = results.value.filter(r => r.id !== resultId);
			return true;
		} catch (error) {
			console.error("Failed to delete result:", error);
			return false;
		}
	};

	const getPopularTags = (): string[] => {
		const tagCounts = new Map<string, number>();
		results.value.forEach(result => {
			result.tags.forEach(tag => {
				tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
			});
		});
		return Array.from(tagCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 20)
			.map(([tag]) => tag);
	};

	return {
		isTagging,
		progress,
		currentResult,
		results,
		generateTags,
		batchTagImages,
		suggestTags,
		getTaggingHistory,
		deleteResult,
		getPopularTags,
	};
}
