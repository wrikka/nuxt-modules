import { desc, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { inventory, stockAlerts } from "~~/server/db/schemas"

export default defineEventHandler(async (_event) => {
	try {
		const alerts = await db.query.stockAlerts.findMany({
			where: eq(stockAlerts.status, "unread"),
			with: {
				inventoryItem: {
					with: {
						productVariant: {
							with: {
								product: true,
							},
						},
					},
				},
			},
			orderBy: [desc(stockAlerts.createdAt)],
		})

		const inventoryItems = await db.query.inventory.findMany({
			with: {
				productVariant: {
					with: {
						product: true,
					},
				},
			},
		})

		for (const item of inventoryItems) {
			const { quantity, productVariant } = item
			const productName = productVariant?.product.name || "Unknown Product"
			const variantName = productVariant?.sku || productVariant?.id || ""

			if (quantity <= 0) {
				alerts.push({
					id: `${item.id}-oos`,
					inventoryId: item.id,
					type: "out-of-stock",
					severity: "high",
					message: `Out of stock: ${productName} (${variantName})`,
					status: "unread",
					createdAt: new Date(),
					inventoryItem: item,
				})
			}
		}

		return alerts.map(alert => ({
			id: alert.id,
			createdAt: alert.createdAt,
			status: alert.status,
			type: alert.type,
			message: alert.message,
			inventoryId: alert.inventoryId,
			severity: alert.severity,
			inventoryItem: alert.inventoryItem,
		}))
	} catch (error) {
		console.error("Failed to get inventory alerts:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to load stock alerts",
		})
	}
})
