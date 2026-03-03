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

	// Get next version number
	const existingHistory = await db.query.projectHistory.findMany({
		where: eq(projectHistory.projectId, id),
		orderBy: desc(projectHistory.version),
		limit: 1,
	});

	const nextVersion = existingHistory.length > 0 ? existingHistory[0]!.version + 1 : 1;

	const historyItem = {
		id: crypto.randomUUID(),
		projectId: id,
		version: nextVersion,
		elements: project.elements,
		snapshot: JSON.stringify(project),
		description: body.description || "Manual snapshot",
		createdBy: body.createdBy,
		createdAt: now,
	};

	await db.insert(projectHistory).values(historyItem);

	return {
		history: {
			...historyItem,
			elements: historyItem.elements,
		},
	};
});
