import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { stockAlerts } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const alertId = event.context.params?.id;
  if (!alertId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid alert ID"
    });
  }
  try {
    const [updatedAlert] = await db.update(stockAlerts).set({ status: "dismissed" }).where(eq(stockAlerts.id, alertId)).returning();
    if (!updatedAlert) {
      throw createError({
        statusCode: 404,
        statusMessage: "Alert not found"
      });
    }
    if (typeof globalThis !== "undefined" && globalThis.io) {
      const io = globalThis.io;
      io.emit("alert_dismissed", alertId);
    }
    return {
      success: true,
      message: "Alert dismissed successfully"
    };
  } catch (error) {
    console.error("Failed to dismiss alert:", error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to dismiss alert"
    });
  }
});
