import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { customerLoyalty, loyaltyTransactions } from "~~/server/db/schemas";
const addPointsSchema = z.object({
  customerId: z.string(),
  orderId: z.string(),
  points: z.number().int().positive(),
  description: z.string(),
  programId: z.string()
  // Assuming a single loyalty program for now
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = addPointsSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: validation.error.flatten()
    });
  }
  const { customerId, orderId, points, description, programId } = validation.data;
  try {
    const [updatedLoyalty] = await db.update(customerLoyalty).set({
      currentPoints: sql`${customerLoyalty.currentPoints} + ${points}`,
      totalEarned: sql`${customerLoyalty.totalEarned} + ${points}`,
      lastActivity: /* @__PURE__ */ new Date()
    }).where(
      and(eq(customerLoyalty.customerId, customerId), eq(customerLoyalty.programId, programId))
    ).returning();
    if (!updatedLoyalty) {
      throw createError({ statusCode: 404, statusMessage: "Customer loyalty account not found." });
    }
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    const [newTransaction] = await db.insert(loyaltyTransactions).values({
      customerId,
      orderId,
      points,
      description,
      type: "earned",
      balance: updatedLoyalty.currentPoints,
      expiresAt
    }).returning();
    return {
      success: true,
      data: newTransaction
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Failed to add loyalty points:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to add loyalty points"
    });
  }
});
