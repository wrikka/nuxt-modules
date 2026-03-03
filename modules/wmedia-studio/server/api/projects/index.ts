import type { Project } from "#shared/types";
import { nanoid } from "nanoid";

const projects = new Map<string, Project>();

export default defineEventHandler(async (event) => {
	const method = event.method;

	if (method === "GET") {
		const data = Array.from(projects.values());
		return { success: true, data };
	}

	if (method === "POST") {
		const body = await readBody(event);
		const project: Project = {
			id: nanoid(),
			name: body.name || "Untitled Project",
			description: body.description,
			thumbnail: body.thumbnail,
			elements: body.elements || [],
			width: body.width || 1920,
			height: body.height || 1080,
			backgroundColor: body.backgroundColor || "#ffffff",
			createdAt: new Date(),
			updatedAt: new Date(),
			lastModifiedBy: body.lastModifiedBy,
			folderId: body.folderId,
			isTemplate: body.isTemplate || false,
			version: 1,
			duration: 0,
			tracks: [],
			timelineItems: [],
			settings: body.settings || {
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
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
