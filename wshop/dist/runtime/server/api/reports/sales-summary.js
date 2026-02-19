import { eq, sql } from "drizzle-orm";
import { db, orders } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const [summary] = await db.select({
      totalSales: sql`sum(${orders.total})`.mapWith(Number),
      totalOrders: sql`count(${orders.id})`.mapWith(Number)
    }).from(orders).where(eq(orders.paymentStatus, "paid"));
    if (!summary) {
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0
      };
    }
    const totalSales = summary.totalSales || 0;
    const totalOrders = summary.totalOrders || 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    return {
      totalSales,
      totalOrders,
      averageOrderValue
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching sales summary:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch sales summary: ${errorMessage}`
    });
  }
});
