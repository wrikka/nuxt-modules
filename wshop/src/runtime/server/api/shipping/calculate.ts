// d:/wshop/server/api/shipping/calculate.ts

import { eq, sql } from "drizzle-orm"
import { db } from "~~/server/db"
import { shippingRates, shippingZones } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { country, weight, price } = body

	if (!country) {
		throw createError({ statusCode: 400, statusMessage: "Country is required" })
	}

	try {
		// Find shipping zone for the country
		const zone = await db.query.shippingZones.findFirst({
			where: sql`${shippingZones.countries}::jsonb ? ${country}`,
		})

		if (!zone) {
			// Default shipping rate
			return { rate: 0, method: "Standard Shipping" }
		}

		// Find applicable shipping rate
		const rates = await db.query.shippingRates.findMany({
			where: eq(shippingRates.zoneId, zone.id),
		})

		let applicableRate = rates.find((r: typeof shippingRates.$inferSelect) => {
			if (r.minWeight !== null && weight < Number(r.minWeight)) return false
			if (r.maxWeight !== null && weight > Number(r.maxWeight)) return false
			if (r.minPrice !== null && price < Number(r.minPrice)) return false
			if (r.maxPrice !== null && price > Number(r.maxPrice)) return false
			return true
		})

		if (!applicableRate) {
			return { rate: Number(zone.baseRate), method: "Standard Shipping" }
		}

		return {
			rate: Number(applicableRate.price),
			method: applicableRate.name,
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error calculating shipping:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to calculate shipping: ${errorMessage}`,
		})
	}
})
