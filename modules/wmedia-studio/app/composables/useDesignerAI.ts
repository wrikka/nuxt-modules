export const useDesignerAI = () => {
	const removeBackground = async (imageUrl: string): Promise<string> => {
		const response = await $fetch<{ success: boolean; url: string }>("/api/ai/remove-background", {
			method: "POST",
			body: { imageUrl },
		});
		if (!response.success) throw new Error("Failed to remove background");
		return response.url;
	};

	const generateImage = async (prompt: string): Promise<string> => {
		const response = await $fetch<{ success: boolean; url: string }>("/api/ai/generate-image", {
			method: "POST",
			body: { prompt },
		});
		if (!response.success) throw new Error("Failed to generate image");
		return response.url;
	};

	return {
		removeBackground,
		generateImage,
	};
};
