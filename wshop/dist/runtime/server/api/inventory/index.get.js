import { db } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const inventory = await db.query.inventory.findMany({
      with: {
        productVariant: {
          with: {
            product: true
          }
        }
      }
    });
    return inventory.map((item) => ({
      ...item,
      availableQuantity: item.quantity - item.reservedQuantity
    }));
  } catch (error) {
    console.error("Failed to get inventory:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load inventory"
    });
  }
});
