import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { paymentTransactions } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const transactionId = getRouterParam(event, "id")

	if (!transactionId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Transaction ID is required",
		})
	}

	try {
		const transaction = await db.query.paymentTransactions.findFirst({
			where: eq(paymentTransactions.id, transactionId),
			columns: {
				id: true,
				status: true,
			},
		})

		if (!transaction) {
			throw createError({
				statusCode: 404,
				statusMessage: "Transaction not found",
			})
		}

		// In a real app, a webhook from the payment provider would update the status.
		// For this refactor, we'll just return the current status from the DB.

		return {
			success: true,
			data: {
				id: transaction.id,
				status: transaction.status,
			},
		}
	} catch (error: any) {
		if (error.statusCode) throw error
		console.error("Failed to get QR payment status:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to get QR payment status",
		})
	}
})
