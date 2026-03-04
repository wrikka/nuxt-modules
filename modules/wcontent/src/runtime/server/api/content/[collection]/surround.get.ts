import { createDatabase } from "../../../../utils/database";
import type { H3Event } from "h3";

// GET /api/content/:collection/surround
export default defineEventHandler(async (event: H3Event) => {
  const collection = getRouterParam(event, "collection");
  if (!collection) {
    throw createError({ statusCode: 400, statusMessage: "Collection required" });
  }

  const query = getQuery(event);
  const path = query.path as string;
  
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: "Path required" });
  }

  const config = useRuntimeConfig().wcontent;
  const db = createDatabase(config.database);
  await db.init();

  try {
    // Get all items sorted by path
    const items = await db.find(collection, {
      sort: [{ field: "_path", direction: "asc" }],
    });

    // Find current item index
    const currentIndex = items.findIndex(item => item._path === path);
    
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
    const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

    return { prev, next };
  } finally {
    await db.close();
  }
});
