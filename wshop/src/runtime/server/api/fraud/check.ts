// d:/wshop/server/api/fraud/check.ts

import { analyzeOrder } from "~~/server/fraud/detection"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { order } = body

	if (!order) {
		throw createError({ statusCode: 400, statusMessage: "Order data is required" })
	}

	try {
		const result = await analyzeOrder(order)
		return result
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error checking fraud:", error)
		throw createError({ statusCode: 500, statusMessage: `Failed to check fraud: ${errorMessage}` })
	}
})
