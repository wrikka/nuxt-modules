import { and, eq, inArray } from "drizzle-orm"
import { db } from "~~/server/db"
import { orderItems, orders, products } from "~~/server/db/schemas"

// TODO: Implement customer authentication middleware that populates event.context.customer
declare module "h3" {
	interface H3EventContext {
		customer: {
			id: string
			name: string | null
			email: string
		} | null
	}
}

export default defineEventHandler(async (event) => {
	// --- Authorization ---
	const customerId = event.context.customer?.id

	if (!customerId) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
	}

	try {
		// 1. Find all paid orders for the customer
		const customerOrders = await db.query.orders.findMany({
			where: and(
				eq(orders.customerId, customerId),
				eq(orders.paymentStatus, "paid"),
			),
			columns: { id: true },
		})

		if (customerOrders.length === 0) {
			return []
		}

		const orderIds: string[] = customerOrders.map((o: { id: string }) => o.id)

		// 2. Find all order items from those orders that are for digital products
		const digitalOrderItems = await db.select({
			productId: orderItems.productId,
		})
			.from(orderItems)
			.innerJoin(products, eq(orderItems.productId, products.id))
			.where(and(
				inArray(orderItems.orderId, orderIds),
				eq(products.type, "digital"),
			))

		if (digitalOrderItems.length === 0) {
			return []
		}

		const productIds = [
			...new Set(
				digitalOrderItems.map((item: { productId: string | null }) => item.productId).filter((
					id,
				): id is string => id !== null),
			),
		]

		// 3. Fetch the product details and their associated digital files
		const downloadableProducts = await db.query.products.findMany({
			where: inArray(products.id, productIds),
			with: {
				digitalFiles: true,
			},
		})

		return downloadableProducts
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error fetching customer downloads:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch downloads: ${errorMessage}`,
		})
	}
})
