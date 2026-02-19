import { count, eq, sql } from "drizzle-orm";
import { db } from "~~/server/db";
import { customers, orders } from "~~/server/db/schemas";
export default defineEventHandler(async (_event) => {
  try {
    const totalRevenueResult = await db.select({ total: sql`sum(${orders.total})` }).from(orders).where(eq(orders.paymentStatus, "paid"));
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const totalOrdersResult = await db.select({ count: count() }).from(orders);
    const totalOrders = totalOrdersResult[0]?.count || 0;
    const totalCustomersResult = await db.select({ count: count() }).from(customers);
    const totalCustomers = totalCustomersResult[0]?.count || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching analytics summary:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch summary: ${errorMessage}`
    });
  }
});
