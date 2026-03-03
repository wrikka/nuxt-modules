import { desc } from "drizzle-orm";
import { folders } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const allFolders = await db.query.folders.findMany({
			orderBy: desc(folders.updatedAt),
		});

		return { success: true, data: allFolders };
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();

		const folder = {
			id: crypto.randomUUID(),
			name: body.name,
			parentId: body.parentId,
			order: body.order || 0,
			createdAt: now,
			updatedAt: now,
		};

		await db.insert(folders).values(folder);

		return { success: true, data: folder };
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
