import { sql } from "drizzle-orm";
import { customers, db } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const [stats] = await db.select({
      totalCustomers: sql`count(${customers.id})`.mapWith(Number),
      newCustomers: sql`count(case when ${customers.orderCount} = 1 then 1 end)`.mapWith(
        Number
      ),
      returningCustomers: sql`count(case when ${customers.orderCount} > 1 then 1 end)`.mapWith(Number)
    }).from(customers);
    if (!stats) {
      return {
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0
      };
    }
    return {
      totalCustomers: stats.totalCustomers || 0,
      newCustomers: stats.newCustomers || 0,
      returningCustomers: stats.returningCustomers || 0
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching customer stats:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch customer stats: ${errorMessage}`
    });
  }
});
