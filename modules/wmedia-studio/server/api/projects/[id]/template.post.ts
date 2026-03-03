import { eq } from "drizzle-orm";
import { projects, templates } from "../../../db/schema";
import { useDb } from "../../../utils/db";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw createError({ statusCode: 400, message: "Project ID is required" });
	}

	const db = useDb();

	// Get project data
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, projectId),
	});

	if (!project) {
		throw createError({ statusCode: 404, message: "Project not found" });
	}

	// Create template from project
	const templateId = crypto.randomUUID();
	await db.insert(templates).values({
		id: templateId,
		name: `${project.name} (Template)`,
		description: project.description,
		thumbnail: project.thumbnail || "",
		category: "custom",
		tags: project.tags || [],
		elements: project.elements,
		width: project.width,
		height: project.height,
		backgroundColor: project.backgroundColor,
		isPremium: false,
		usageCount: 0,
		rating: 0,
		createdBy: project.createdBy,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	// Mark project as template
	await db
		.update(projects)
		.set({ isTemplate: true, updatedAt: new Date() })
		.where(eq(projects.id, projectId));

	return { success: true, templateId };
});
