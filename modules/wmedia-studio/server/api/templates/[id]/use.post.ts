import type { Template } from "#shared/types";
import type { Project } from "#shared/types";
import { nanoid } from "nanoid";

const templates = new Map<string, Template>();
const projects = new Map<string, Project>();

export default defineEventHandler(async (event) => {
	const templateId = getRouterParam(event, "id");

	if (!templateId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Template ID is required",
		});
	}

	const template = templates.get(templateId);

	if (!template) {
		throw createError({
			statusCode: 404,
			statusMessage: "Template not found",
		});
	}

	const project: Project = {
		id: nanoid(),
		name: `${template.name} (Copy)`,
		description: template.description,
		thumbnail: template.thumbnail,
		elements: [...template.elements],
		width: template.width,
		height: template.height,
		backgroundColor: template.backgroundColor,
		createdAt: new Date(),
		updatedAt: new Date(),
		isTemplate: false,
		version: 1,
		duration: 0,
		tracks: [],
		timelineItems: [],
		settings: {
			width: template.width,
			height: template.height,
			snapToGrid: false,
			gridSize: 10,
			showGuides: false,
			showRulers: false,
			autoSave: true,
			autoSaveInterval: 30000,
		},
	};

	projects.set(project.id, project);

	return { success: true, data: { projectId: project.id } };
});
