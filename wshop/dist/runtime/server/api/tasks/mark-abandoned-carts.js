import { and, eq, lt } from "drizzle-orm";
import { carts, db } from "~~/server/db";
export default defineEventHandler(async (event) => {
  const secret = getHeader(event, "x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
    const result = await db.update(carts).set({
      status: "abandoned",
      abandonedAt: /* @__PURE__ */ new Date()
    }).where(
      and(
        eq(carts.status, "active"),
        lt(carts.updatedAt, oneHourAgo)
      )
    ).returning({ id: carts.id });
    console.log(`Marked ${result.length} carts as abandoned.`);
    return { success: true, markedCarts: result.length };
  } catch (error) {
    console.error("Error marking abandoned carts:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to mark abandoned carts: ${errorMessage}`
    });
  }
});
