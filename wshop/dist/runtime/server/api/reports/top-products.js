import { desc, eq, sql } from "drizzle-orm";
import { db, orderItems, products } from "~~/server/db";
export default defineEventHandler(async () => {
  try {
    const topProducts = await db.select({
      productId: orderItems.productId,
      productName: products.name,
      totalSold: sql`sum(${orderItems.quantity})`.mapWith(Number)
    }).from(orderItems).leftJoin(products, eq(orderItems.productId, products.id)).groupBy(orderItems.productId, products.name).orderBy(desc(sql`sum(${orderItems.quantity})`)).limit(5);
    return topProducts;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching top products:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch top products: ${errorMessage}`
    });
  }
});
