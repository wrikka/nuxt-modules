import { desc, eq } from "drizzle-orm";
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

	// Get exports
	const exports = await db.query.projectExports.findMany({
		where: eq(projectExports.projectId, id),
		orderBy: desc(projectExports.createdAt),
	});

	return {
		exports,
	};
});
