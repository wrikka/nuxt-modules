import { desc } from "drizzle-orm";
import { brandKits } from "../../db/schema";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (_event) => {
	const db = useDb();

	const allBrandKits = await db.query.brandKits.findMany({
		orderBy: desc(brandKits.updatedAt),
	});

	return {
		success: true,
		data: allBrandKits,
	};
});
