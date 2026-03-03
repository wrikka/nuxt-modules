import { eq } from "drizzle-orm";
import { projects } from "../../../db/schema";
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
	const now = new Date();

	// Fetch original project
	const original = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!original) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	// Update project status to archived
	await db.update(projects)
		.set({ status: "archived", updatedAt: now })
		.where(eq(projects.id, id));

	// Fetch updated project
	const updated = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!updated) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	return {
		project: {
			...updated,
			elements: updated.elements,
			tracks: updated.tracks,
			timelineItems: updated.timelineItems,
			settings: {
				snapToGrid: updated.settingsSnapToGrid,
				gridSize: updated.settingsGridSize,
				showGuides: updated.settingsShowGuides,
				showRulers: updated.settingsShowRulers,
				autoSave: updated.settingsAutoSave,
				autoSaveInterval: updated.settingsAutoSaveInterval,
			},
		},
	};
});
