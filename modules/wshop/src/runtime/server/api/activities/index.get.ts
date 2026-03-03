import { desc } from "drizzle-orm"
import { db } from "~~/server/db"
import { customers, orders } from "~~/server/db/schemas"

// Define a type for the combined activity stream
interface Activity {
	id: string
	type: "order" | "customer"
	description: string
	timestamp: Date
	user?: {
		name: string | null
		email: string
	}
}

export default defineEventHandler(async () => {
	try {
		const recentOrders = await db.query.orders.findMany({
			limit: 10,
			orderBy: [desc(orders.createdAt)],
			with: {
				customer: {
					columns: {
						name: true,
						email: true,
					},
				},
			},
		})

		const recentCustomers = await db.query.customers.findMany({
			limit: 10,
			orderBy: [desc(customers.createdAt)],
			columns: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		})

		const orderActivities: Activity[] = recentOrders.map(order => ({
			id: `order-${order.id}`,
			type: "order",
			description: `New order #${order.id.substring(0, 8)} for ${order.total}`,
			timestamp: order.createdAt,
			user: order.customer ? { name: order.customer.name, email: order.customer.email } : undefined,
		}))

		const customerActivities: Activity[] = recentCustomers.map(customer => ({
			id: `customer-${customer.id}`,
			type: "customer",
			description: `New customer signed up: ${customer.name || customer.email}`,
			timestamp: customer.createdAt,
			user: { name: customer.name, email: customer.email },
		}))

		const combinedActivities = [...orderActivities, ...customerActivities]

		// Sort all activities by timestamp descending and take the latest 10
		const sortedActivities = combinedActivities
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.slice(0, 10)

		return sortedActivities
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error fetching activities:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch activities: ${errorMessage}`,
		})
	}
})
