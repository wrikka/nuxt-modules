import { ilike } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import { products } from "~~/server/db/schemas"

const suggestionsQuerySchema = z.object({
	q: z.string(),
	limit: z.coerce.number().int().positive().optional().default(10),
})

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, (q) => suggestionsQuerySchema.safeParse(q))

	if (!query.success) {
		return []
	}

	const { q: searchQuery, limit } = query.data

	if (!searchQuery?.trim()) {
		return []
	}

	try {
		const suggestions = await db.query.products.findMany({
			where: ilike(products.name, `%${searchQuery}%`),
			limit,
			columns: {
				id: true,
				name: true,
				handle: true,
			},
		})
		return suggestions
	} catch (error) {
		console.error("Failed to get product suggestions:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to get product suggestions",
		})
	}
})
