import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { orders } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const paymentIntentId = event.context.params?.id;
  if (!paymentIntentId) {
    throw createError({ statusCode: 400, statusMessage: "Payment Intent ID is required" });
  }
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.paymentIntentId, paymentIntentId),
      with: {
        items: {
          with: {
            product: true,
            variant: true
          }
        }
      }
    });
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: "Order not found" });
    }
    return order;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error fetching order by payment intent ID ${paymentIntentId}:`, error);
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch order: ${errorMessage}` });
  }
});
