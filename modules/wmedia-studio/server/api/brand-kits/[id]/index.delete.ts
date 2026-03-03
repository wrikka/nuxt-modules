import { eq } from "drizzle-orm";
import { brandColors, brandFonts, brandKits, brandLogos } from "../../../db/schema";
import { useDb } from "../../../utils/db";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Brand Kit ID is required",
		});
	}

	const db = useDb();

	await db.delete(brandKits).where(eq(brandKits.id, id));
	await db.delete(brandColors).where(eq(brandColors.brandKitId, id));
	await db.delete(brandFonts).where(eq(brandFonts.brandKitId, id));
	await db.delete(brandLogos).where(eq(brandLogos.brandKitId, id));

	return {
		success: true,
	};
});
