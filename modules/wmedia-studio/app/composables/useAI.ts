import type {
	AIBackgroundRemoverRequest,
	AIBackgroundRemoverResponse,
	AIColorPaletteRequest,
	AIColorPaletteResponse,
	AIContentGenerationRequest,
	AIContentGenerationResponse,
	AIImageUpscaleRequest,
	AIImageUpscaleResponse,
	AILayoutSuggestionRequest,
	AILayoutSuggestionResponse,
	AIMagicResizeRequest,
	AIMagicResizeResponse,
	AIResponse,
	AITemplateSearchRequest,
	AITemplateSearchResponse,
} from "#shared/types";

export const useAI = () => {
	const loading = ref(false);
	const error = ref<string | null>(null);

	const searchTemplates = async (request: AITemplateSearchRequest): Promise<AITemplateSearchResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AITemplateSearchResponse>>("/api/ai/templates/search", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to search templates");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to search templates";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const magicResize = async (request: AIMagicResizeRequest): Promise<AIMagicResizeResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AIMagicResizeResponse>>("/api/ai/magic-resize", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to magic resize");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to magic resize";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const removeBackground = async (request: AIBackgroundRemoverRequest): Promise<AIBackgroundRemoverResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AIBackgroundRemoverResponse>>("/api/ai/background-remover", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to remove background");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to remove background";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const suggestLayout = async (request: AILayoutSuggestionRequest): Promise<AILayoutSuggestionResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AILayoutSuggestionResponse>>("/api/ai/layout-suggestion", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to suggest layout");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to suggest layout";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const generateColorPalette = async (request: AIColorPaletteRequest): Promise<AIColorPaletteResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AIColorPaletteResponse>>("/api/ai/color-palette", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to generate color palette");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate color palette";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const generateContent = async (request: AIContentGenerationRequest): Promise<AIContentGenerationResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AIContentGenerationResponse>>("/api/ai/content-generation", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to generate content");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate content";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const upscaleImage = async (request: AIImageUpscaleRequest): Promise<AIImageUpscaleResponse> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<AIResponse<AIImageUpscaleResponse>>("/api/ai/image-upscale", {
				method: "POST",
				body: request,
			});

			if (!response.success || !response.data) {
				throw new Error(response.error || "Failed to upscale image");
			}

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to upscale image";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		error,
		searchTemplates,
		magicResize,
		removeBackground,
		suggestLayout,
		generateColorPalette,
		generateContent,
		upscaleImage,
	};
};
