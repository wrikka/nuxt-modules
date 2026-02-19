import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { posSessions } from "~~/server/db/schemas";
const createSessionSchema = z.object({
  openingAmount: z.number().min(0)
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const sessions = await db.query.posSessions.findMany({
        with: {
          staff: {
            columns: {
              name: true
            }
          }
        },
        orderBy: [desc(posSessions.openedAt)]
      });
      return sessions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch POS sessions: ${errorMessage}`
      });
    }
  }
  if (method === "POST") {
    const body = await readBody(event);
    const validation = createSessionSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid data",
        data: validation.error.flatten()
      });
    }
    const { openingAmount } = validation.data;
    const user = event.context.user;
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    try {
      const [newSession] = await db.insert(posSessions).values({
        staffId: user.id,
        openingAmount: openingAmount.toFixed(2)
      }).returning();
      return { success: true, session: newSession };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create POS session: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
