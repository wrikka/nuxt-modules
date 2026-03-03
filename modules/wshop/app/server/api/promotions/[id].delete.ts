import type { Promotion } from "~~/shared/types"

export default defineEventHandler(async (event) => {
	const promotionId = parseInt(getRouterParam(event, "id") as string)

	if (isNaN(promotionId)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid promotion ID",
		})
	}

	try {
		// Get existing promotions
		const promotions = await $fetch<Promotion[]>("/api/promotions")
		const promotionIndex = promotions.findIndex(p => p.id === promotionId)

		if (promotionIndex === -1) {
			throw createError({
				statusCode: 404,
				statusMessage: "Promotion not found",
			})
		}

		// Check if promotion is currently active
		const promotion = promotions[promotionIndex]
		if (!promotion) {
			throw createError({
				statusCode: 404,
				statusMessage: "Promotion not found",
			})
		}
		if (promotion.status === "active") {
			throw createError({
				statusCode: 400,
				statusMessage: "Cannot delete active promotion. Please deactivate it first.",
			})
		}

		// In a real app, this would delete from database
		console.log("Deleted promotion:", promotions[promotionIndex])

		return {
			success: true,
			message: "Promotion deleted successfully",
		}
	} catch (error) {
		console.error("Failed to delete promotion:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to delete promotion",
		})
	}
})
