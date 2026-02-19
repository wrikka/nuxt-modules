import { db } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const tiers = await db.query.loyaltyTiers.findMany({
      orderBy: (tiers2, { asc }) => [asc(tiers2.minPoints)]
    });
    return {
      success: true,
      data: tiers
    };
  } catch (error) {
    console.error("Failed to get membership tiers:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load membership tiers"
    });
  }
});
