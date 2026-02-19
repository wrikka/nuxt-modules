import { sql } from "drizzle-orm";
import { db, orders } from "~~/server/db";
export default defineEventHandler(async () => {
  try {
    const totalRevenueResult = await db.select({
      total: sql`sum(cast(${orders.total} as numeric))`
    }).from(orders);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const stats = [
      {
        name: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        change: "+4.75%",
        icon: "i-mdi-currency-usd"
      },
      {
        name: "Overdue Invoices",
        value: "$0.00",
        change: "+0.00%",
        icon: "i-mdi-file-chart-outline"
      },
      {
        name: "Outstanding Invoices",
        value: "$0.00",
        change: "+0.00%",
        icon: "i-mdi-file-document-outline"
      },
      {
        name: "Expenses",
        value: "$0.00",
        change: "+0.00%",
        icon: "i-mdi-arrow-down-bold-circle-outline"
      }
    ];
    return stats;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching stats:", error);
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch stats: ${errorMessage}` });
  }
});
