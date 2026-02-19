import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { giftCards } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code");
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: "Gift card code is required" });
  }
  try {
    const card = await db.query.giftCards.findFirst({
      where: and(
        eq(giftCards.code, code.toUpperCase()),
        eq(giftCards.isActive, "true")
        // Optional: Check if the card has expired
        // gte(giftCards.expiresAt, new Date()),
      ),
      columns: {
        code: true,
        currentBalance: true,
        initialBalance: true,
        expiresAt: true
      }
    });
    if (!card) {
      throw createError({
        statusCode: 404,
        statusMessage: "Gift card not found, has expired, or is inactive."
      });
    }
    return card;
  } catch (error) {
    const h3Error = error;
    if (h3Error.statusCode) throw h3Error;
    console.error("Error fetching gift card:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not retrieve gift card information."
    });
  }
});
