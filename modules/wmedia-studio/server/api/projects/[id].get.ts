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
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!project) {
		throw notFound("Project", id);
	}

	return successResponse({
		project: {
			...project,
			settings: {
				snapToGrid: project.settingsSnapToGrid,
				gridSize: project.settingsGridSize,
				showGuides: project.settingsShowGuides,
				showRulers: project.settingsShowRulers,
				autoSave: project.settingsAutoSave,
				autoSaveInterval: project.settingsAutoSaveInterval,
			},
		},
	});
});
