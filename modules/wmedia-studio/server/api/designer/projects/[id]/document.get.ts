import { eq } from "drizzle-orm";
import { projects } from "../../../../db/schema";
import { useDb } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required",
		});
	}

	const db = useDb();
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	const metadata = (project.metadata ?? {}) as Record<string, unknown>;
	const designer = (metadata.designer ?? null) as unknown;

	return {
		success: true,
		data: designer,
	};
});
