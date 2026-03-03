import { desc, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { inventoryLogs } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const inventoryId = query.inventoryId as string | undefined

	try {
		const movements = await db.query.inventoryLogs.findMany({
			where: inventoryId ? eq(inventoryLogs.inventoryId, inventoryId) : undefined,
			with: {
				user: {
					columns: {
						name: true,
					},
				},
			},
			orderBy: [desc(inventoryLogs.timestamp)],
			limit: 100, // Limit the number of movements returned
		})

		return movements
	} catch (error) {
		console.error("Failed to get inventory movements:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to load stock movements",
		})
	}
})
