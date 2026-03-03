import { eq } from "drizzle-orm";
import { brandKits } from "../../../db/schema";
import { useDb } from "../../../utils/db";
import { updateBrandKitItems } from "../utils";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Brand Kit ID is required",
		});
	}

	const db = useDb();
	const body = await readBody(event);

	const existing = await db.query.brandKits.findFirst({
		where: eq(brandKits.id, id),
	});

	if (!existing) {
		throw createError({
			statusCode: 404,
			statusMessage: "Brand Kit not found",
		});
	}

	const now = new Date();
	await db
		.update(brandKits)
		.set({
			name: body.name || existing.name,
			updatedAt: now,
		})
		.where(eq(brandKits.id, id));

	await updateBrandKitItems(id, body);

	return {
		success: true,
	};
});
