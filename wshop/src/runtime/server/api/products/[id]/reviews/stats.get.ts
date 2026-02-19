import { avg, count, eq, sql } from "drizzle-orm"
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
		const [stats] = await db
			.select({
				averageRating: avg(productReviews.rating),
				totalReviews: count(productReviews.id),
			})
			.from(productReviews)
			.where(eq(productReviews.productId, productId))

		const distributionResult = await db
			.select({
				rating: productReviews.rating,
				count: sql<number>`count(${productReviews.id})`.mapWith(Number),
			})
			.from(productReviews)
			.where(eq(productReviews.productId, productId))
			.groupBy(productReviews.rating)

		const ratingDistribution = distributionResult.reduce((acc, row) => {
			acc[row.rating] = row.count
			return acc
		}, {} as Record<number, number>)

		return {
			averageRating: stats?.averageRating ? parseFloat(stats.averageRating).toFixed(1) : "0.0",
			totalReviews: stats?.totalReviews || 0,
			ratingDistribution,
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error fetching review stats for product ${productId}:`, error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch review stats: ${errorMessage}`,
		})
	}
})
