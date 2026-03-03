import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { orders } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const orderId = event.context.params?.id as string

	if (!orderId) {
		throw createError({ statusCode: 400, statusMessage: "Order ID is required" })
	}

	try {
		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			with: {
				customer: true,
				items: {
					with: {
						product: true,
						variant: true,
					},
				},
			},
		})

		if (!order) {
			throw createError({ statusCode: 404, statusMessage: "Order not found" })
		}
		return order
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error fetching order ${orderId}:`, error)
		throw createError({ statusCode: 500, statusMessage: `Failed to fetch order: ${errorMessage}` })
	}
})
