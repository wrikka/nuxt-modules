import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { customers } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const customerId = event.context.params?.id as string

	if (!customerId) {
		throw createError({ statusCode: 400, statusMessage: "Customer ID is required" })
	}

	try {
		const customer = await db.query.customers.findFirst({
			where: eq(customers.id, customerId),
			with: {
				orders: {
					orderBy: (orders, { desc }) => [desc(orders.createdAt)],
				},
			},
		})

		if (!customer) {
			throw createError({ statusCode: 404, statusMessage: "Customer not found" })
		}
		return customer
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error fetching customer ${customerId}:`, error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch customer: ${errorMessage}`,
		})
	}
})
