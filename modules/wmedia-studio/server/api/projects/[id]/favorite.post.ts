import { eq } from "drizzle-orm";
import { projects } from "../../../db/schema";
import { FavoriteProjectSchema } from "../../../schemas/project.schema";
import { useDb } from "../../../utils/db";
import { notFound, successResponse } from "../../../utils/error";
import { validateBody } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw notFound("Project");
	}

	const body = await validateBody(event, FavoriteProjectSchema);
	const db = useDb();

	// Check if project exists
	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, projectId),
	});

	if (!existing) {
		throw notFound("Project", projectId);
	}

	await db
		.update(projects)
		.set({
			isFavorite: body.isFavorite,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, projectId));

	return successResponse({
		success: true,
		isFavorite: body.isFavorite,
	});
});
