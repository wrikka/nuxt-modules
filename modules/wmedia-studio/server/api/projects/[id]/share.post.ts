import { eq } from "drizzle-orm";
import { projects, projectShares } from "../../../db/schema";
import { useDb } from "../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID is required",
		});
	}

	const body = await readBody(event);
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

	const share = {
		id: crypto.randomUUID(),
		projectId: id,
		userId: body.userId,
		role: body.role || "viewer",
		createdAt: now,
	};

	await db.insert(projectShares).values(share);

	return {
		success: true,
		message: "Member invited successfully",
		data: share,
	};
});
