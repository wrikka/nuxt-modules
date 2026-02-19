import { db } from "~~/server/db";
import { stockAlerts } from "~~/server/db/schemas";
export default defineTask({
  meta: {
    name: "inventory:alerts",
    description: "Generate stock alerts for low, out of stock, and overstocked items."
  },
  async run() {
    try {
      const inventoryItems = await db.query.inventory.findMany();
      for (const item of inventoryItems) {
        const { id, quantity, reorderLevel, maxLevel } = item;
        if (quantity <= 0) {
          await db.insert(stockAlerts).values({
            inventoryId: id,
            type: "out_of_stock",
            severity: "critical",
            message: `Product variant is out of stock.`
          }).onConflictDoNothing();
        } else if (quantity <= reorderLevel) {
          await db.insert(stockAlerts).values({
            inventoryId: id,
            type: "low_stock",
            severity: "high",
            message: `Stock is low (${quantity} remaining).`
          }).onConflictDoNothing();
        } else if (quantity > maxLevel) {
          await db.insert(stockAlerts).values({
            inventoryId: id,
            type: "overstock",
            severity: "medium",
            message: `Stock is overstocked (${quantity} units, max: ${maxLevel}).`
          }).onConflictDoNothing();
        }
      }
      return { result: "Inventory alerts checked successfully." };
    } catch (error) {
      console.error("Error generating inventory alerts:", error);
      return { error: "Failed to generate inventory alerts." };
    }
  }
});
