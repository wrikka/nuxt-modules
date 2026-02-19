import { db } from "~~/server/db";
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const alerts = await db.query.fraudAlerts.findMany({
        with: {
          order: {
            with: {
              customer: true
            }
          }
        },
        orderBy: (alerts2, { desc }) => [desc(alerts2.createdAt)],
        limit: 50
        // Limit the number of alerts returned
      });
      return alerts.map((alert) => ({
        id: alert.id,
        orderId: alert.orderId,
        customerEmail: alert.order.customer?.email,
        riskScore: alert.riskScore,
        riskLevel: alert.riskLevel,
        reasons: alert.reasons,
        createdAt: alert.createdAt
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching fraud alerts:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch fraud alerts: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
