import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { pages } from "~~/server/db/schemas";
export default defineEventHandler(async () => {
  const allPages = await db.query.pages.findMany({
    where: eq(pages.status, "published"),
    columns: {
      slug: true,
      updatedAt: true
    }
  });
  return allPages.map((p) => ({
    loc: `/${p.slug}`,
    lastmod: p.updatedAt
  }));
});
