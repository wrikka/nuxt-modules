import { generateId } from "../../../shared/utils/id";
import { brandKits } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const db = useDb();
	const body = await readBody(event);

	if (!body || typeof body.name !== "string") {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid brand kit name",
		});
	}

	const now = new Date();
	const newKitId = generateId("brand-kit");

	const newBrandKit = {
		id: newKitId,
		name: body.name,
		createdAt: now,
		updatedAt: now,
	};

	await db.insert(brandKits).values(newBrandKit);

	return {
		success: true,
		data: newBrandKit,
	};
});
