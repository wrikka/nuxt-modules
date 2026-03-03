import { db } from "~~/server/db"
import { inventory } from "~~/server/db/schemas"

export async function seedInventory() {
	const variants = await db.query.productVariants.findMany()

	if (variants.length === 0) {
		console.log("No product variants found to seed inventory.")
		return
	}

	const inventoryItems = variants.map(variant => ({
		productVariantId: variant.id,
		quantity: variant.stock, // Use stock from variant
		reservedQuantity: 0,
		location: "Warehouse A",
	}))

	for (const item of inventoryItems) {
		await db.insert(inventory).values(item).onConflictDoNothing()
	}

	console.log("✓ Inventory seeded successfully")
}
