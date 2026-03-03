import type { AIColorPaletteResponse, AIResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const _body = await readBody(event);

	const response: AIResponse<AIColorPaletteResponse> = {
		success: true,
		data: {
			colors: ["#3b82f6", "#1d4ed8", "#60a5fa", "#93c5fd", "#dbeafe"],
			name: "Ocean Blue",
		},
	};

	return response;
});
