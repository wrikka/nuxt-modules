import { eq } from "drizzle-orm";
import { projects } from "../../db/schema";
import { UpdateProjectSchema } from "../../schemas/project.schema";
import { useDb } from "../../utils/db";
import { notFound, successResponse } from "../../utils/error";
import { validateBody } from "../../utils/validation";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw notFound("Project");
	}

	const body = await validateBody(event, UpdateProjectSchema);
	const db = useDb();

	// Check if project exists
	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!existing) {
		throw notFound("Project", id);
	}

	// Update project
	await db
		.update(projects)
		.set({
			...body,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, id));

	// Fetch updated project
	const updated = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!updated) {
		throw notFound("Project", id);
	}

	return successResponse({
		project: {
			...updated,
			settings: {
				snapToGrid: updated.settingsSnapToGrid,
				gridSize: updated.settingsGridSize,
				showGuides: updated.settingsShowGuides,
				showRulers: updated.settingsShowRulers,
				autoSave: updated.settingsAutoSave,
				autoSaveInterval: updated.settingsAutoSaveInterval,
			},
		},
	});
});
