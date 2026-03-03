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
	const kit = await db.query.brandKits.findFirst({
		where: eq(brandKits.id, id),
	});

	if (!kit) {
		throw createError({
			statusCode: 404,
			statusMessage: "Brand Kit not found",
		});
	}

	const [colors, fonts, logos] = await Promise.all([
		db.query.brandColors.findMany({ where: eq(brandColors.brandKitId, id) }),
		db.query.brandFonts.findMany({ where: eq(brandFonts.brandKitId, id) }),
		db.query.brandLogos.findMany({ where: eq(brandLogos.brandKitId, id) }),
	]);

	return {
		success: true,
		data: {
			...kit,
			colors,
			fonts,
			logos,
		},
	};
});
