import { eq } from "drizzle-orm";
import { projectExports, projects } from "../../../db/schema";
import { useDb } from "../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required",
		});
	}

	const body = await readBody(event);
	const db = useDb();
	const now = new Date();

	// Check if project exists
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	const exportItem = {
		id: crypto.randomUUID(),
		projectId: id,
		format: body.format,
		status: "pending" as const,
		createdAt: now,
	};

	await db.insert(projectExports).values(exportItem);

	return {
		export: exportItem,
	};
});
