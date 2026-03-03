import type { AIImageUpscaleResponse, AIResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const response: AIResponse<AIImageUpscaleResponse> = {
		success: true,
		data: {
			imageId: body.imageId,
			url: `https://example.com/upscaled/${body.imageId}.png`,
		},
	};

	return response;
});
