import type { AILayoutSuggestionResponse, AIResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const _body = await readBody(event);

	const response: AIResponse<AILayoutSuggestionResponse> = {
		success: true,
		data: {
			elements: [],
			confidence: 0.85,
		},
	};

	return response;
});
