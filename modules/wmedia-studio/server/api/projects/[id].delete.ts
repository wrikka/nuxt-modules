import { eq } from "drizzle-orm";
import { projects } from "../../db/schema";
import { useDb } from "../../utils/db";
import { notFound, successResponse } from "../../utils/error";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw notFound("Project");
	}

	const db = useDb();

	// Check if project exists
	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!existing) {
		throw notFound("Project", id);
	}

	// Delete the project permanently
	await db.delete(projects).where(eq(projects.id, id));

	return successResponse({
		success: true,
		message: "Project deleted successfully",
	});
});
