// d:/wshop/app/server/api/orders/index.ts

import { desc } from "drizzle-orm"
import { db } from "~~/server/db"
import { insertOrderSchema, orders } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all orders
	if (method === "GET") {
		try {
			const allOrders = await db.query.orders.findMany({
				with: {
					customer: true,
				},
				orderBy: [desc(orders.createdAt)],
			})
			return allOrders
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching orders:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch orders: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new order
	if (method === "POST") {
		const body = await readBody(event)
		const validation = insertOrderSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid order data",
				data: validation.error.flatten(),
			})
		}

		try {
			const [newOrder] = await db.insert(orders).values(validation.data).returning()
			return newOrder
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating order:", errorMessage)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create order: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
