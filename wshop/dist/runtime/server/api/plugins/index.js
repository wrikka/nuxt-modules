import { count, desc, eq } from "drizzle-orm";
import { createError, defineEventHandler, getMethod, getQuery, readBody } from "h3";
import { z } from "zod";
import { db } from "~~/server/db";
import { pluginInstallations, plugins } from "~~/server/db/schemas";
const getPluginsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});
const managePluginSchema = z.object({
  pluginId: z.string()
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    const query = getQuery(event);
    const validation = getPluginsQuerySchema.safeParse(query);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
        data: validation.error.issues
      });
    }
    const { page, limit } = validation.data;
    const offset = (page - 1) * limit;
    try {
      const allPlugins = await db.query.plugins.findMany({
        with: {
          installations: {
            columns: {
              isInstalled: true
            }
          }
        },
        orderBy: [desc(plugins.createdAt)],
        limit,
        offset
      });
      const totalCountResult = await db.select({ count: count() }).from(plugins);
      const totalCount = totalCountResult[0]?.count || 0;
      event.node.res.setHeader("X-Total-Count", totalCount.toString());
      event.node.res.setHeader("X-Page", page.toString());
      event.node.res.setHeader("X-Per-Page", limit.toString());
      return allPlugins;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching plugins:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch plugins: ${errorMessage}`
      });
    }
  }
  if (method === "POST") {
    const body = await readBody(event);
    const validation = managePluginSchema.safeParse(body);
    if (!validation.success) {
      throw createError({ statusCode: 400, statusMessage: "Invalid request body" });
    }
    const { pluginId } = validation.data;
    try {
      const [newInstallation] = await db.insert(pluginInstallations).values({
        pluginId,
        isInstalled: true
      }).returning();
      return { success: true, installation: newInstallation };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to install plugin: ${errorMessage}`
      });
    }
  }
  if (method === "DELETE") {
    const body = await readBody(event);
    const validation = managePluginSchema.safeParse(body);
    if (!validation.success) {
      throw createError({ statusCode: 400, statusMessage: "Invalid request body" });
    }
    const { pluginId } = validation.data;
    try {
      await db.delete(pluginInstallations).where(eq(pluginInstallations.pluginId, pluginId));
      return { success: true, message: "Plugin uninstalled" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to uninstall plugin: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
});
