import { eq } from "drizzle-orm";
import { generateId } from "../../../shared/utils/id";
import { brandColors, brandFonts, brandLogos } from "../../db/schema";
import { useDb } from "../../utils/db";

const db = useDb();

export const updateBrandKitItems = async (kitId: string, body: any) => {
	// Colors
	if (Array.isArray(body.colors)) {
		await db.delete(brandColors).where(eq(brandColors.brandKitId, kitId));
		if (body.colors.length > 0) {
			await db.insert(brandColors).values(
				body.colors.map((c: any) => ({
					id: generateId("color"),
					brandKitId: kitId,
					name: c.name,
					hex: c.hex,
				})),
			);
		}
	}

	// Fonts
	if (Array.isArray(body.fonts)) {
		await db.delete(brandFonts).where(eq(brandFonts.brandKitId, kitId));
		if (body.fonts.length > 0) {
			await db.insert(brandFonts).values(
				body.fonts.map((f: any) => ({
					id: generateId("font"),
					brandKitId: kitId,
					name: f.name,
					family: f.family,
					weights: f.weights,
				})),
			);
		}
	}

	// Logos
	if (Array.isArray(body.logos)) {
		await db.delete(brandLogos).where(eq(brandLogos.brandKitId, kitId));
		if (body.logos.length > 0) {
			await db.insert(brandLogos).values(
				body.logos.map((l: any) => ({
					id: generateId("logo"),
					brandKitId: kitId,
					name: l.name,
					url: l.url,
				})),
			);
		}
	}
};
