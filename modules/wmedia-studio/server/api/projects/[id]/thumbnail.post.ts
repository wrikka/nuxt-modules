import { eq } from "drizzle-orm";
import { projects } from "../../../db/schema";
import { useDb } from "../../../utils/db";

export default defineEventHandler(async (event) => {
	const projectId = getRouterParam(event, "id");

	if (!projectId) {
		throw createError({ statusCode: 400, message: "Project ID is required" });
	}

	const form = await readFormData(event);
	const thumbnail = form.get("thumbnail");

	if (!thumbnail || !(thumbnail instanceof File)) {
		throw createError({ statusCode: 400, message: "Thumbnail file is required" });
	}

	// Validate file type
	if (!thumbnail.type.startsWith("image/")) {
		throw createError({ statusCode: 400, message: "File must be an image" });
	}

	// Validate file size (max 5MB)
	if (thumbnail.size > 5 * 1024 * 1024) {
		throw createError({ statusCode: 400, message: "File size must be less than 5MB" });
	}

	// TODO: Upload to storage and get URL
	// For now, create a data URL
	const buffer = await thumbnail.arrayBuffer();
	const base64 = Buffer.from(buffer).toString("base64");
	const thumbnailUrl = `data:${thumbnail.type};base64,${base64}`;

	const db = useDb();

	await db
		.update(projects)
		.set({
			thumbnail: thumbnailUrl,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, projectId));

	return { success: true, thumbnailUrl };
});
