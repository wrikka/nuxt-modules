import { and, eq, isNull, lt } from "drizzle-orm";
import { db } from "~~/server/db/index";
import { carts } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const secret = getHeader(event, "x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  try {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1e3);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
    const cartsToSend = await db.query.carts.findMany({
      where: and(
        eq(carts.status, "abandoned"),
        isNull(carts.recoveryEmailSentAt),
        lt(carts.abandonedAt, thirtyMinsAgo),
        lt(carts.abandonedAt, twentyFourHoursAgo)
        // Don't email for carts abandoned > 24h ago
      ),
      limit: 50
      // Process in batches
    });
    let sentCount = 0;
    for (const cart of cartsToSend) {
      try {
        await $fetch("/api/emails/send-recovery", {
          method: "POST",
          headers: {
            "x-cron-secret": process.env.CRON_SECRET
          },
          body: { cartId: cart.id }
        });
        sentCount++;
      } catch (error) {
        console.error(`Failed to send recovery email for cart ${cart.id}:`, error);
      }
    }
    console.log(`Sent ${sentCount} recovery emails.`);
    return { success: true, sentEmails: sentCount };
  } catch (error) {
    console.error("Error sending recovery emails:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to send recovery emails: ${errorMessage}`
    });
  }
});
