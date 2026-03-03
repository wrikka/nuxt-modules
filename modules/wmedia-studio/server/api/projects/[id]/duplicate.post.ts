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

	// Create duplicate
	const newId = crypto.randomUUID();
	const duplicated = {
		...original,
		id: newId,
		name: `${original.name} (Copy)`,
		createdAt: now,
		updatedAt: now,
	};

	await db.insert(projects).values(duplicated);

	return {
		project: {
			...duplicated,
			elements: duplicated.elements,
			tracks: duplicated.tracks,
			timelineItems: duplicated.timelineItems,
			settings: {
				snapToGrid: duplicated.settingsSnapToGrid,
				gridSize: duplicated.settingsGridSize,
				showGuides: duplicated.settingsShowGuides,
				showRulers: duplicated.settingsShowRulers,
				autoSave: duplicated.settingsAutoSave,
				autoSaveInterval: duplicated.settingsAutoSaveInterval,
			},
		},
	};
});
