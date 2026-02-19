import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import { orderStatusEnum, paymentStatusEnum } from "~~/server/db/enums"
import { orders } from "~~/server/db/schemas/orders"

const updateOrderSchema = z.object({
	status: z.enum(orderStatusEnum.enumValues).optional(),
	paymentStatus: z.enum(paymentStatusEnum.enumValues).optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	const orderId = event.context.params?.id as string

	if (!orderId) {
		throw createError({ statusCode: 400, statusMessage: "Order ID is required" })
	}

	// GET: Fetch a single order by ID
	if (method === "GET") {
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
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch order: ${errorMessage}`,
			})
		}
	}

	// PUT: Update an existing order
	if (method === "PUT") {
		const body = await readBody(event)
		const validation = updateOrderSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid order data",
				data: validation.error.flatten(),
			})
		}

		if (Object.keys(validation.data).length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "At least one field to update must be provided",
			})
		}

		try {
			const updatedOrder = await db
				.update(orders)
				.set({
					...(validation.data.status
						&& { status: validation.data.status as (typeof orderStatusEnum.enumValues)[number] }),
					...(validation.data.paymentStatus
						&& {
							paymentStatus: validation.data
								.paymentStatus as (typeof paymentStatusEnum.enumValues)[number],
						}),
					updatedAt: new Date(),
				})
				.where(eq(orders.id, orderId))
				.returning()

			if (updatedOrder.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Order not found" })
			}
			return updatedOrder[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error updating order ${orderId}:`, error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to update order: ${errorMessage}`,
			})
		}
	}

	// DELETE: Remove an order
	if (method === "DELETE") {
		try {
			const deletedOrder = await db.delete(orders).where(eq(orders.id, orderId)).returning()

			if (deletedOrder.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Order not found" })
			}

			return { success: true, message: `Order ${orderId} deleted` }
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error deleting order ${orderId}:`, error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to delete order: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
