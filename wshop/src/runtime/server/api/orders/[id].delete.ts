import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { orders } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const orderId = event.context.params?.id as string

	if (!orderId) {
		throw createError({ statusCode: 400, statusMessage: "Order ID is required" })
	}

	try {
		const deletedOrder = await db.delete(orders).where(eq(orders.id, orderId)).returning()

		if (deletedOrder.length === 0) {
			throw createError({ statusCode: 404, statusMessage: "Order not found" })
		}

		return { success: true, message: `Order ${orderId} deleted` }
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error deleting order ${orderId}:`, error)
		throw createError({ statusCode: 500, statusMessage: `Failed to delete order: ${errorMessage}` })
	}
})
