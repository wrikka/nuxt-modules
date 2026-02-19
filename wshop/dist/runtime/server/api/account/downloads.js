import { and, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/db";
import { orderItems, orders, products } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const customerId = event.context.customer?.id;
  if (!customerId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  try {
    const customerOrders = await db.query.orders.findMany({
      where: and(
        eq(orders.customerId, customerId),
        eq(orders.paymentStatus, "paid")
      ),
      columns: { id: true }
    });
    if (customerOrders.length === 0) {
      return [];
    }
    const orderIds = customerOrders.map((o) => o.id);
    const digitalOrderItems = await db.select({
      productId: orderItems.productId
    }).from(orderItems).innerJoin(products, eq(orderItems.productId, products.id)).where(and(
      inArray(orderItems.orderId, orderIds),
      eq(products.type, "digital")
    ));
    if (digitalOrderItems.length === 0) {
      return [];
    }
    const productIds = [
      ...new Set(
        digitalOrderItems.map((item) => item.productId).filter((id) => id !== null)
      )
    ];
    const downloadableProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      with: {
        digitalFiles: true
      }
    });
    return downloadableProducts;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching customer downloads:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch downloads: ${errorMessage}`
    });
  }
});
