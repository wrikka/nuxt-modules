import { desc, eq } from "drizzle-orm";
import { projectHistory, projects } from "../../../db/schema";
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

	// Get history
	const existingHistory = await db.query.projectHistory.findMany({
		where: eq(projectHistory.projectId, id),
		orderBy: desc(projectHistory.createdAt),
	});

	const _nextVersion = existingHistory.length > 0 ? existingHistory[0]!.version + 1 : 1;

	const history = existingHistory.map((historyItem) => ({
		elements: historyItem.elements,
	}));

	return {
		history: history,
	};
});
