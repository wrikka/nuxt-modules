import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { customerLoyalty, loyaltyTransactions } from "~~/server/db/schemas";
const redeemPointsSchema = z.object({
  customerId: z.string(),
  pointsUsed: z.number().int().positive(),
  description: z.string(),
  programId: z.string()
  // Assuming a single loyalty program for now
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = redeemPointsSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: validation.error.flatten()
    });
  }
  const { customerId, pointsUsed, description, programId } = validation.data;
  try {
    const [loyaltyAccount] = await db.select().from(customerLoyalty).where(
      and(eq(customerLoyalty.customerId, customerId), eq(customerLoyalty.programId, programId))
    );
    if (!loyaltyAccount || loyaltyAccount.currentPoints < pointsUsed) {
      throw createError({ statusCode: 400, statusMessage: "Insufficient points." });
    }
    const [updatedLoyalty] = await db.update(customerLoyalty).set({
      currentPoints: sql`${customerLoyalty.currentPoints} - ${pointsUsed}`,
      totalRedeemed: sql`${customerLoyalty.totalRedeemed} + ${pointsUsed}`,
      lastActivity: /* @__PURE__ */ new Date()
    }).where(
      and(eq(customerLoyalty.customerId, customerId), eq(customerLoyalty.programId, programId))
    ).returning();
    if (!updatedLoyalty) {
      throw createError({ statusCode: 500, statusMessage: "Failed to update loyalty account." });
    }
    const [newTransaction] = await db.insert(loyaltyTransactions).values({
      customerId,
      points: -pointsUsed,
      description,
      type: "redeemed",
      balance: updatedLoyalty.currentPoints
    }).returning();
    return {
      success: true,
      data: newTransaction
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Failed to redeem loyalty points:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to redeem loyalty points"
    });
  }
});
