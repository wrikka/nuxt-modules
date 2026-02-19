import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { pages } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  const query = getQuery(event);
  const locale = query.locale || "en";
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" });
  }
  try {
    const page = await db.query.pages.findFirst({
      where: and(
        eq(pages.slug, slug),
        eq(pages.locale, locale),
        eq(pages.status, "published")
        // Only return published pages
      )
    });
    if (!page) {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    }
    return page;
  } catch (error) {
    if (typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 404) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch page: ${errorMessage}` });
  }
});
