import type { Promotion } from "~~/shared/types"

export default defineEventHandler(async (event) => {
	const body = await readBody<Omit<Promotion, "id" | "createdAt" | "updatedAt" | "usageCount">>(
		event,
	)

	const {
		name,
		description,
		type,
		discountValue,
		startDate,
		endDate,
		maxUsage,
		maxUsagePerCustomer,
		conditions,
	} = body

	if (!name || name.trim().length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Promotion name is required",
		})
	}

	if (!type) {
		throw createError({
			statusCode: 400,
			statusMessage: "Promotion type is required",
		})
	}

	if (discountValue === undefined || discountValue < 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Discount value is required and must be non-negative",
		})
	}

	if (!startDate || !endDate) {
		throw createError({
			statusCode: 400,
			statusMessage: "Start date and end date are required",
		})
	}

	// Validate dates
	const start = new Date(startDate)
	const end = new Date(endDate)
	const now = new Date()

	if (start >= end) {
		throw createError({
			statusCode: 400,
			statusMessage: "End date must be after start date",
		})
	}

	if (start < now) {
		throw createError({
			statusCode: 400,
			statusMessage: "Start date cannot be in the past",
		})
	}

	// Validate discount value based on type
	if (type === "percentage" && (discountValue > 100 || discountValue < 0)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Percentage discount must be between 0 and 100",
		})
	}

	if (type === "fixed" && discountValue < 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Fixed discount must be non-negative",
		})
	}

	try {
		// Get existing promotions to generate new ID
		const promotions = await $fetch<Promotion[]>("/api/promotions")
		const newId = Math.max(...promotions.map(p => p.id), 0) + 1

		const newPromotion: Promotion = {
			id: newId,
			name: name.trim(),
			description: description?.trim() || "",
			type,
			discountValue,
			startDate,
			endDate,
			status: start <= now && end >= now ? "active" : "scheduled",
			maxUsage: maxUsage || null,
			usageLimit: maxUsage || null,
			maxUsagePerCustomer: maxUsagePerCustomer || null,
			minimumAmount: conditions?.minPurchase || null,
			usageCount: 0,
			conditions: conditions || {
				minPurchase: null,
				minQuantity: null,
				customerTypes: [],
				productCategories: [],
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		// In a real app, this would save to database
		console.log("Created promotion:", newPromotion)

		return newPromotion
	} catch (error) {
		console.error("Failed to create promotion:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to create promotion",
		})
	}
})
