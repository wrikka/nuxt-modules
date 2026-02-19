// d:/wshop/app/server/api/discounts/index.ts

import { db } from "~~/server/db"
import { discounts, insertDiscountSchema } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all discounts
	if (method === "GET") {
		try {
			const allDiscounts = await db.query.discounts.findMany({
				orderBy: (discounts, { desc }) => [desc(discounts.createdAt)],
			})
			return allDiscounts
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching discounts:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch discounts: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new discount
	if (method === "POST") {
		const body = await readBody(event)
		const validation = insertDiscountSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid discount data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newDiscount = await db.insert(discounts).values(validation.data).returning()
			return newDiscount[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating discount:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create discount: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
