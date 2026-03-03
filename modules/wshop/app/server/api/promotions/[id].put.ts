import type { Promotion } from "~~/shared/types"

export default defineEventHandler(async (event) => {
	const promotionId = parseInt(getRouterParam(event, "id") as string)
	const body = await readBody<Partial<Promotion>>(event)

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

		const existingPromotion = promotions[promotionIndex]

		if (!existingPromotion) {
			throw createError({
				statusCode: 404,
				statusMessage: "Promotion not found",
			})
		}

		// Validate dates if provided
		if (body.startDate && body.endDate) {
			const start = new Date(body.startDate)
			const end = new Date(body.endDate)

			if (start >= end) {
				throw createError({
					statusCode: 400,
					statusMessage: "End date must be after start date",
				})
			}
		}

		// Validate discount value if provided
		if (body.discountValue !== undefined) {
			if (body.type === "percentage" && (body.discountValue > 100 || body.discountValue < 0)) {
				throw createError({
					statusCode: 400,
					statusMessage: "Percentage discount must be between 0 and 100",
				})
			}

			if (body.type === "fixed" && body.discountValue < 0) {
				throw createError({
					statusCode: 400,
					statusMessage: "Fixed discount must be non-negative",
				})
			}
		}

		// Update promotion
		const updatedPromotion: Promotion = {
			...existingPromotion,
			...body,
			id: promotionId, // Ensure ID doesn't change
			updatedAt: new Date().toISOString(),
		} as Promotion

		// Update status based on dates if they were changed
		if (body.startDate || body.endDate) {
			const now = new Date()
			const start = new Date(body.startDate || existingPromotion.startDate)
			const end = new Date(body.endDate || existingPromotion.endDate)

			if (now >= start && now <= end) {
				updatedPromotion.status = "active"
			} else if (now < start) {
				updatedPromotion.status = "scheduled"
			} else {
				updatedPromotion.status = "inactive"
			}
		}

		// In a real app, this would update the database
		console.log("Updated promotion:", updatedPromotion)

		return updatedPromotion
	} catch (error) {
		console.error("Failed to update promotion:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to update promotion",
		})
	}
})
