import type { AIContentGenerationResponse, AIResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const _body = await readBody(event);

	const response: AIResponse<AIContentGenerationResponse> = {
		success: true,
		data: {
			content: "Generated content based on your prompt",
		},
	};

	return response;
});
