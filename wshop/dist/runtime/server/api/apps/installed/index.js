import { db } from "~~/server/db";
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const installed = await db.query.installedApps.findMany({
        with: {
          app: true
        }
      });
      return installed;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching installed apps:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch installed apps: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
