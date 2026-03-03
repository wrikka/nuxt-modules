import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { projects } from "../../db/schema";
import { ProjectQuerySchema } from "../../schemas/project.schema";
import { useDb } from "../../utils/db";
import { successResponse } from "../../utils/error";
import { validateQuery } from "../../utils/validation";

export default defineEventHandler(async (event) => {
	const db = useDb();

	// Validate and parse query parameters
	const query = validateQuery(event, ProjectQuerySchema);

	// Build where conditions
	const conditions = [];

	// Filter by deleted status (default: exclude deleted)
	conditions.push(eq(projects.isDeleted, query.isDeleted));

	if (query.type) {
		conditions.push(eq(projects.type, query.type));
	}

	if (query.status) {
		conditions.push(eq(projects.status, query.status));
	}

	if (query.folderId !== undefined) {
		if (query.folderId === "") {
			conditions.push(sql`${projects.folderId} IS NULL`);
		} else {
			conditions.push(eq(projects.folderId, query.folderId));
		}
	}

	if (query.isFavorite !== undefined) {
		conditions.push(eq(projects.isFavorite, query.isFavorite));
	}

	if (query.search) {
		conditions.push(
			or(
				like(projects.name, `%${query.search}%`),
				like(projects.description, `%${query.search}%`),
			),
		);
	}

	// Execute query with filtering and sorting
	const orderColumn = {
		updated: projects.updatedAt,
		created: projects.createdAt,
		name: projects.name,
		size: projects.size,
	}[query.sortBy];

	const orderFn = query.sortOrder === "desc" ? desc : (col: any) => col;

	const allProjects = await db.query.projects.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		orderBy: orderFn(orderColumn),
		limit: query.limit,
		offset: (query.page - 1) * query.limit,
	});

	// Get total count for pagination
	const countResult = await db
		.select({ count: sql<number>`count(*)` })
		.from(projects)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	const totalCount = countResult[0]?.count ?? 0;

	return successResponse({
		projects: allProjects.map((project) => ({
			...project,
			settings: {
				snapToGrid: project.settingsSnapToGrid,
				gridSize: project.settingsGridSize,
				showGuides: project.settingsShowGuides,
				showRulers: project.settingsShowRulers,
				autoSave: project.settingsAutoSave,
				autoSaveInterval: project.settingsAutoSaveInterval,
			},
		})),
		pagination: {
			page: query.page,
			limit: query.limit,
			total: Number(totalCount),
			totalPages: Math.ceil(Number(totalCount) / query.limit),
		},
	});
});
