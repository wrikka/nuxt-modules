import { desc } from "drizzle-orm";
import { templates } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const allTemplates = await db.query.templates.findMany({
			orderBy: desc(templates.updatedAt),
		});

		return {
			success: true,
			data: allTemplates,
		};
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();

		const template = {
			id: crypto.randomUUID(),
			name: body.name,
			description: body.description,
			thumbnail: body.thumbnail,
			category: body.category,
			tags: body.tags || [],
			elements: body.elements || [],
			width: body.width,
			height: body.height,
			backgroundColor: body.backgroundColor || "#ffffff",
			isPremium: body.isPremium || false,
			usageCount: 0,
			rating: 0,
			createdBy: body.createdBy,
			createdAt: now,
			updatedAt: now,
		};

		await db.insert(templates).values(template);

		return {
			success: true,
			data: {
				...template,
				tags: body.tags || [],
				elements: body.elements || [],
			},
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
