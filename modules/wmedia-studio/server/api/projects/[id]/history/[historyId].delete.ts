import { eq } from "drizzle-orm";
import { projectHistory, projects } from "../../../../db/schema";
import { useDb } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const historyId = getRouterParam(event, "historyId");

	if (!id || !historyId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID and History ID are required",
		});
	}

	const db = useDb();

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

	// Delete history entry
	await db.delete(projectHistory).where(eq(projectHistory.id, historyId));

	return {
		success: true,
		message: "History deleted successfully",
	};
});
