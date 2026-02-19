import { desc } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import { products } from "~~/server/db/schemas"

const popularQuerySchema = z.object({
	limit: z.coerce.number().int().positive().optional().default(10),
})

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, (q) => popularQuerySchema.safeParse(q))

	if (!query.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid query parameters",
			data: query.error.flatten(),
		})
	}

	const { limit } = query.data

	try {
		const popularProducts = await db.query.products.findMany({
			orderBy: [desc(products.createdAt)], // Using createdAt as a proxy for popularity
			limit,
			with: {
				images: true,
			},
		})
		return popularProducts
	} catch (error) {
		console.error("Failed to get popular products:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to get popular products",
		})
	}
})
