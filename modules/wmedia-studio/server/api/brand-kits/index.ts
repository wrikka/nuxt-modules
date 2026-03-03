import { desc, eq } from "drizzle-orm";
import { brandColors, brandFonts, brandKits, brandLogos } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const db = useDb();

	if (method === "GET") {
		const allKits = await db.query.brandKits.findMany({
			orderBy: desc(brandKits.updatedAt),
		});

		// Fetch related data for each kit
		const kitsWithDetails = await Promise.all(
			allKits.map(async (kit) => {
				const colors = await db.query.brandColors.findMany({
					where: eq(brandColors.brandKitId, kit.id),
				});
				const fonts = await db.query.brandFonts.findMany({
					where: eq(brandFonts.brandKitId, kit.id),
				});
				const logos = await db.query.brandLogos.findMany({
					where: eq(brandLogos.brandKitId, kit.id),
				});

				return {
					...kit,
					templates: kit.templates,
					colors: colors.map((c) => ({ ...c, isPrimary: Boolean(c.isPrimary) })),
					fonts: fonts.map((f) => ({ ...f, weights: f.weights, isPrimary: Boolean(f.isPrimary) })),
					logos: logos.map((l) => ({ ...l, isPrimary: Boolean(l.isPrimary) })),
				};
			}),
		);

		return { success: true, data: kitsWithDetails };
	}

	if (method === "POST") {
		const body = await readBody(event);
		const now = new Date();
		const kitId = crypto.randomUUID();

		// Insert brand kit
		await db.insert(brandKits).values({
			id: kitId,
			name: body.name,
			templates: body.templates || [],
			createdAt: now,
			updatedAt: now,
		});

		// Insert colors
		if (body.colors?.length) {
			await db.insert(brandColors).values(
				body.colors.map((color: any) => ({
					id: crypto.randomUUID(),
					brandKitId: kitId,
					name: color.name,
					hex: color.hex,
					isPrimary: color.isPrimary || false,
				})),
			);
		}

		// Insert fonts
		if (body.fonts?.length) {
			await db.insert(brandFonts).values(
				body.fonts.map((font: any) => ({
					id: crypto.randomUUID(),
					brandKitId: kitId,
					name: font.name,
					family: font.family,
					weights: font.weights || [],
					isPrimary: font.isPrimary || false,
				})),
			);
		}

		// Insert logos
		if (body.logos?.length) {
			await db.insert(brandLogos).values(
				body.logos.map((logo: any) => ({
					id: crypto.randomUUID(),
					brandKitId: kitId,
					name: logo.name,
					url: logo.url,
					thumbnail: logo.thumbnail,
					isPrimary: logo.isPrimary || false,
				})),
			);
		}

		return {
			success: true,
			data: {
				id: kitId,
				name: body.name,
				templates: body.templates || [],
				colors: body.colors || [],
				fonts: body.fonts || [],
				logos: body.logos || [],
				createdAt: now,
				updatedAt: now,
			},
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
	});
});
