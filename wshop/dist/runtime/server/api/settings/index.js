import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { settings } from "~~/server/db/schemas";
const updateSettingsSchema = z.object({
  activeTheme: z.string().optional(),
  themeConfig: z.record(z.any()).optional()
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const currentSettings = await db.query.settings.findFirst({
        where: eq(settings.id, "global")
      });
      return currentSettings || { id: "global", activeTheme: "default", themeConfig: {} };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching settings:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch settings: ${errorMessage}`
      });
    }
  }
  if (method === "POST" || method === "PUT") {
    const body = await readBody(event);
    const validation = updateSettingsSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid settings data",
        data: validation.error.flatten()
      });
    }
    try {
      const existingSettings = await db.query.settings.findFirst({
        where: eq(settings.id, "global")
      });
      if (existingSettings) {
        await db.update(settings).set(validation.data).where(eq(settings.id, "global"));
      } else {
        await db.insert(settings).values({
          id: "global",
          ...validation.data
        });
      }
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error updating settings:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update settings: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
