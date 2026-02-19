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
    const [updatedAlert] = await db.update(stockAlerts).set({ status: "read" }).where(eq(stockAlerts.id, alertId)).returning();
    if (!updatedAlert) {
      throw createError({
        statusCode: 404,
        statusMessage: "Alert not found"
      });
    }
    if (typeof globalThis !== "undefined" && globalThis.io) {
      const io = globalThis.io;
      io.emit("alert_updated", updatedAlert);
    }
    return {
      success: true,
      message: "Alert marked as read"
    };
  } catch (error) {
    console.error("Failed to mark alert as read:", error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to mark alert as read"
    });
  }
});
