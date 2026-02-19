import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { inventory, inventoryLogs } from "~~/server/db/schemas";
const adjustStockSchema = z.object({
  variantId: z.string(),
  type: z.enum(["in", "out", "adjust"]),
  quantity: z.number().int().positive(),
  reason: z.string()
});
export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const validation = adjustStockSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid required fields",
      data: validation.error.flatten()
    });
  }
  const { variantId, type, quantity, reason } = validation.data;
  try {
    const inventoryItem = await db.query.inventory.findFirst({
      where: eq(inventory.productVariantId, variantId),
      with: {
        productVariant: {
          with: {
            product: true
          }
        }
      }
    });
    if (!inventoryItem) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product variant not found in inventory"
      });
    }
    let newQuantity = inventoryItem.quantity;
    let change = 0;
    switch (type) {
      case "in":
        newQuantity += quantity;
        change = quantity;
        break;
      case "out":
        if (newQuantity < quantity) {
          throw createError({
            statusCode: 400,
            statusMessage: "Insufficient stock"
          });
        }
        newQuantity -= quantity;
        change = -quantity;
        break;
      case "adjust":
        change = quantity - newQuantity;
        newQuantity = quantity;
        break;
    }
    const [updatedInventory] = await db.update(inventory).set({ quantity: newQuantity, lastUpdated: /* @__PURE__ */ new Date() }).where(eq(inventory.id, inventoryItem.id)).returning();
    if (!updatedInventory) {
      throw createError({ statusCode: 500, statusMessage: "Failed to update inventory stock." });
    }
    const [newLog] = await db.insert(inventoryLogs).values({
      inventoryId: inventoryItem.id,
      change,
      newQuantity,
      reason,
      source: "Manual Adjustment",
      userId: user.id
    }).returning();
    if (typeof globalThis !== "undefined" && globalThis.io) {
      const io = globalThis.io;
      io.emit("inventory_update", {
        ...updatedInventory,
        availableQuantity: updatedInventory.quantity - updatedInventory.reservedQuantity,
        productVariant: inventoryItem.productVariant
      });
      io.emit("stock_movement", newLog);
    }
    return {
      success: true,
      message: "Stock adjusted successfully",
      newQuantity,
      newAvailableQuantity: newQuantity - inventoryItem.reservedQuantity
    };
  } catch (error) {
    console.error("Failed to adjust stock:", error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to adjust stock: ${error.message}`
    });
  }
});
