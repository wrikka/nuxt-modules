import { z } from "zod";
import { db } from "~~/server/db";
import { paymentTransactions } from "~~/server/db/schemas";
const cashPaymentSchema = z.object({
  amount: z.number().positive(),
  cashReceived: z.number().positive(),
  orderId: z.string()
}).refine((data) => data.cashReceived >= data.amount, {
  message: "Cash received must be greater than or equal to amount",
  path: ["cashReceived"]
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = cashPaymentSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid payment data",
      data: validation.error.flatten()
    });
  }
  const { amount, cashReceived, orderId } = validation.data;
  const change = cashReceived - amount;
  try {
    const [newTransaction] = await db.insert(paymentTransactions).values({
      orderId,
      amount: String(amount),
      method: "cash",
      status: "completed",
      metadata: { cashReceived, change }
    }).returning();
    return {
      success: true,
      data: newTransaction
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error processing cash payment:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to process cash payment: ${errorMessage}`
    });
  }
});
