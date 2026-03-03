import { eq, sql } from "drizzle-orm"
import { db, orders } from "~~/server/db"

export default defineEventHandler(async (_event) => {
	// In a real app, you'd parse query params for date ranges
	// For now, we calculate all-time stats for paid orders.

	try {
		const [summary] = await db
			.select({
				totalSales: sql<number>`sum(${orders.total})`.mapWith(Number),
				totalOrders: sql<number>`count(${orders.id})`.mapWith(Number),
			})
			.from(orders)
			.where(eq(orders.paymentStatus, "paid"))

		if (!summary) {
			return {
				totalSales: 0,
				totalOrders: 0,
				averageOrderValue: 0,
			}
		}
		const totalSales = summary.totalSales || 0
		const totalOrders = summary.totalOrders || 0
		const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

		return {
			totalSales,
			totalOrders,
			averageOrderValue,
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error fetching sales summary:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch sales summary: ${errorMessage}`,
		})
	}
})
