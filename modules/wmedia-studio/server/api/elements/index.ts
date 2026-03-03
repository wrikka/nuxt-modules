import { desc } from "drizzle-orm";
import { elements } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const query = getQuery(event);
		const projectId = query.projectId as string | undefined;

		let allElements = await db.query.elements.findMany({
			orderBy: desc(elements.updatedAt),
		});

		if (projectId) {
			allElements = allElements.filter((e) => e.projectId === projectId);
		}

		return {
			success: true,
			data: allElements.map((el) => ({
				...el,
				data: JSON.parse(el.data as string),
			})),
		};
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();

		const element = {
			id: body.id || crypto.randomUUID(),
			projectId: body.projectId,
			type: body.type,
			x: body.x || 0,
			y: body.y || 0,
			width: body.width || 100,
			height: body.height || 100,
			rotation: body.rotation || 0,
			opacity: body.opacity ?? 1,
			locked: body.locked || false,
			visible: body.visible ?? true,
			zIndex: body.zIndex || 0,
			data: JSON.stringify(body.data || {}),
			createdAt: now,
			updatedAt: now,
		};

		await db.insert(elements).values(element);

		return {
			success: true,
			data: {
				...element,
				data: body.data || {},
			},
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
