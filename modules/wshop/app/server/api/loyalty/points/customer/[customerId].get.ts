import { desc, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { loyaltyTransactions } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const customerId = getRouterParam(event, "customerId")

	if (!customerId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Customer ID is required",
		})
	}

	try {
		const transactions = await db.query.loyaltyTransactions.findMany({
			where: eq(loyaltyTransactions.customerId, customerId),
			orderBy: [desc(loyaltyTransactions.createdAt)],
		})

		return {
			success: true,
			data: transactions,
		}
	} catch (error: any) {
		console.error("Failed to fetch loyalty history:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to fetch loyalty history",
		})
	}
})
