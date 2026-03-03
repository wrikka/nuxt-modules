import type { Project } from "#shared/types";

const projects = new Map<string, Project>();

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required",
		});
	}

	const method = event.method;

	if (method === "GET") {
		const project = projects.get(projectId);

		if (!project) {
			throw createError({
				statusCode: 404,
				statusMessage: "Project not found",
			});
		}

		return { success: true, data: project };
	}

	if (method === "PUT") {
		const body = await readBody(event);
		const project = projects.get(projectId);

		if (!project) {
			throw createError({
				statusCode: 404,
				statusMessage: "Project not found",
			});
		}

		const updatedProject: Project = {
			...project,
			...body,
			id: projectId,
			updatedAt: new Date(),
			version: project.version + 1,
		};

		projects.set(projectId, updatedProject);

		return { success: true, data: updatedProject };
	}

	if (method === "DELETE") {
		const project = projects.get(projectId);

		if (!project) {
			throw createError({
				statusCode: 404,
				statusMessage: "Project not found",
			});
		}

		projects.delete(projectId);

		return { success: true, data: { projectId } };
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
