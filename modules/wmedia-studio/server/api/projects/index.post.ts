import { nanoid } from "nanoid";
import { projects } from "../../db/schema";
import { CreateProjectSchema } from "../../schemas/project.schema";
import { useDb } from "../../utils/db";
import { successResponse } from "../../utils/error";
import { validateBody } from "../../utils/validation";

export default defineEventHandler(async (event) => {
	const body = await validateBody(event, CreateProjectSchema);

	const db = useDb();
	const now = new Date();

	const project = {
		id: nanoid(),
		name: body.name,
		description: body.description,
		type: body.type,
		width: body.width,
		height: body.height,
		backgroundColor: body.backgroundColor,
		elements: [],
		tracks: "[]",
		timelineItems: "[]",
		duration: 0,
		status: "active" as const,
		version: 1,
		isTemplate: false,
		folderId: body.folderId,
		createdAt: now,
		updatedAt: now,
		settingsSnapToGrid: true,
		settingsGridSize: 10,
		settingsShowGuides: true,
		settingsShowRulers: true,
		settingsAutoSave: true,
		settingsAutoSaveInterval: 60,
		isFavorite: false,
		isDeleted: false,
		size: 0,
		tags: [],
		sharedWith: [],
	};

	await db.insert(projects).values(project);

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
