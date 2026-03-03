import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import { orders, productReviews } from "~~/server/db/schemas"

const createReviewSchema = z.object({
	rating: z.number().min(1).max(5),
	title: z.string().optional(),
	content: z.string().min(1, "Review content is required"),
	// TODO: Add image handling
})

export default defineEventHandler(async (event) => {
	const productId = getRouterParam(event, "id") as string
	// TODO: Get customerId from authenticated user
	const customerId = "a1b2c3d4-e5f6-7890-1234-567890abcdef" // Placeholder

	if (!productId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product ID",
		})
	}

	const body = await readBody(event)
	const validation = createReviewSchema.safeParse(body)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid review data",
			data: validation.error.flatten(),
		})
	}

	try {
		// Business logic: Check if the customer has purchased this product
		const customerOrders = await db.query.orders.findMany({
			where: eq(orders.customerId, customerId),
			with: { items: true },
		})

		const hasPurchasedProduct = customerOrders.some(order =>
			order.items.some(item => item.productId === productId)
		)

		if (!hasPurchasedProduct) {
			throw createError({
				statusCode: 403,
				statusMessage: "You can only review products you have purchased.",
			})
		}

		const [newReview] = await db.insert(productReviews).values({
			...validation.data,
			productId,
			customerId,
			status: "pending",
		}).returning()

		return { success: true, review: newReview }
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error creating review for product ${productId}:`, error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to create review: ${errorMessage}`,
		})
	}
})
