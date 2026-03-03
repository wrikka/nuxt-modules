import type { AIResponse, AITemplateSearchResponse } from "#shared/types";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const templates = [
		{ id: "1", name: "Social Media Post", category: "social-media" },
		{ id: "2", name: "Presentation Slide", category: "presentation" },
		{ id: "3", name: "Poster", category: "poster" },
	];

	const filteredTemplates = templates.filter((t) => {
		const matchesQuery = t.name.toLowerCase().includes(body.query?.toLowerCase() || "");
		const matchesCategory = !body.category || t.category === body.category;
		return matchesQuery && matchesCategory;
	});

	const response: AIResponse<AITemplateSearchResponse> = {
		success: true,
		data: {
			templates: filteredTemplates.map((t) => t.id),
			confidence: 0.9,
		},
	};

	return response;
});
