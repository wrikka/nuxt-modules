import { db } from "~~/server/db"

export default defineEventHandler(async (_event) => {
	try {
		const tiers = await db.query.loyaltyTiers.findMany({
			orderBy: (tiers, { asc }) => [asc(tiers.minPoints)],
		})

		return {
			success: true,
			data: tiers,
		}
	} catch (error) {
		console.error("Failed to get membership tiers:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to load membership tiers",
		})
	}
})
