import { createDatabase } from "../../utils/database";
import type { H3Event } from "h3";

// GET /api/__sitemap__/content
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const db = createDatabase(config.wcontent.database);
  await db.init();

  try {
    const collections = config.wcontent.collections || ["blog", "docs", "pages"];
    const urls: Array<{ loc: string; lastmod?: string; priority?: number; changefreq?: string }> = [];

    for (const collection of collections) {
      try {
        const items = await db.find(collection, {
          where: { _draft: false },
        });

        for (const item of items) {
          urls.push({
            loc: item._path,
            lastmod: item.updatedAt,
            priority: item._collection === "blog" ? 0.8 : 0.5,
            changefreq: "weekly",
          });
        }
      } catch {
        // Collection might not exist
      }
    }

    return urls;
  } finally {
    await db.close();
  }
});
