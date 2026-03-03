import { eq } from "drizzle-orm";
import { projectHistory, projects } from "../../../../../db/schema";
import { useDb } from "../../../../../utils/db";

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

	// Get history entry
	const historyEntry = await db.query.projectHistory.findFirst({
		where: eq(projectHistory.id, historyId),
	});

	if (!historyEntry) {
		throw createError({
			statusCode: 404,
			statusMessage: "History entry not found",
		});
	}

	// Restore project from snapshot
	const snapshot = JSON.parse(historyEntry.snapshot);
	await db.update(projects)
		.set({
			...snapshot,
			id: project.id, // Keep the same ID
			updatedAt: now,
		})
		.where(eq(projects.id, id));

	// Fetch updated project
	const updated = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	return {
		project: updated
			? {
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
			}
			: null,
	};
});
