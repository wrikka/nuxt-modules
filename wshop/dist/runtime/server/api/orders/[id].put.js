import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { orderStatusEnum, paymentStatusEnum } from "~~/server/db/enums";
import { orders } from "~~/server/db/schemas/orders";
const updateOrderSchema = z.object({
  status: z.enum(orderStatusEnum.enumValues).optional(),
  paymentStatus: z.enum(paymentStatusEnum.enumValues).optional()
});
export default defineEventHandler(async (event) => {
  const orderId = event.context.params?.id;
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: "Order ID is required" });
  }
  const body = await readBody(event);
  const validation = updateOrderSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid order data",
      data: validation.error.flatten()
    });
  }
  if (Object.keys(validation.data).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "At least one field to update must be provided"
    });
  }
  try {
    const updatedOrder = await db.update(orders).set({
      ...validation.data.status && { status: validation.data.status },
      ...validation.data.paymentStatus && {
        paymentStatus: validation.data.paymentStatus
      },
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(orders.id, orderId)).returning();
    if (updatedOrder.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Order not found" });
    }
    return updatedOrder[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error updating order ${orderId}:`, error);
    throw createError({ statusCode: 500, statusMessage: `Failed to update order: ${errorMessage}` });
  }
});
