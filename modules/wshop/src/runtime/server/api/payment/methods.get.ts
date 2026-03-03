import { db } from "~~/server/db"

export default defineEventHandler(async (_event) => {
	try {
		const methods = await db.query.paymentMethods.findMany()
		return {
			success: true,
			data: methods,
		}
	} catch (error) {
		console.error("Failed to get payment methods:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to load payment methods",
		})
	}
})
