import { eq } from "drizzle-orm";
import { projects } from "../../../db/schema";
import { useDb } from "../../../utils/db";
import { notFound, successResponse } from "../../../utils/error";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw notFound("Project");
	}

	const db = useDb();

	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, projectId),
	});

	if (!existing) {
		throw notFound("Project", projectId);
	}

	await db
		.update(projects)
		.set({
			isDeleted: false,
			deletedAt: null,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, projectId));

	return successResponse({ success: true, message: "Project restored from trash" });
});
