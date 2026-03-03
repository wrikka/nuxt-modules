import { and, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { productReviews } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const productId = getRouterParam(event, "id") as string

	if (!productId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product ID",
		})
	}

	try {
		const reviews = await db.query.productReviews.findMany({
			where: and(
				eq(productReviews.productId, productId),
				eq(productReviews.status, "approved"),
			),
			with: {
				customer: {
					columns: { name: true },
				},
			},
			orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
		})

		return reviews
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error fetching reviews for product ${productId}:`, error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch reviews: ${errorMessage}`,
		})
	}
})
