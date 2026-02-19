import { mockPromotions } from "~/server/data/promotions"

export default defineEventHandler(async (_event) => {
	try {
		return mockPromotions
	} catch (error) {
		console.error("Failed to fetch promotions:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to fetch promotions",
		})
	}
})
