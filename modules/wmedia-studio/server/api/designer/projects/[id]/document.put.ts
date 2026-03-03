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

	const body = await readBody(event);
	if (!body || typeof body !== "object") {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid request body",
		});
	}

	const db = useDb();

	const existing = await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});

	if (!existing) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	const now = new Date();
	const metadata = (existing.metadata ?? {}) as Record<string, unknown>;
	const nextMetadata = {
		...metadata,
		designer: body,
	};

	await db
		.update(projects)
		.set({
			metadata: nextMetadata,
			updatedAt: now,
		})
		.where(eq(projects.id, id));

	return {
		success: true,
		data: body,
	};
});
