import type { AIMagicResizeResponse, AIResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const response: AIResponse<AIMagicResizeResponse> = {
		success: true,
		data: {
			projectId: body.projectId,
			elements: [],
		},
	};

	return response;
});
