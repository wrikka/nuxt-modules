import { eq } from "drizzle-orm";
import { projects, projectShares } from "../../../../db/schema";
import { useDb } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const memberId = getRouterParam(event, "memberId");

	if (!id || !memberId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project ID and Member ID are required",
		});
	}

	const db = useDb();

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

	// Delete share
	await db.delete(projectShares).where(eq(projectShares.id, memberId));

	return {
		success: true,
		message: "Member removed successfully",
	};
});
