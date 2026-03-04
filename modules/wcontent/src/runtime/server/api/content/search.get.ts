import { createDatabase } from "../../../utils/database";
import type { H3Event } from "h3";

// GET /api/content/search
export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const searchQuery = query.q as string;
  
  if (!searchQuery) {
    throw createError({ statusCode: 400, statusMessage: "Search query required" });
  }

  const config = useRuntimeConfig().wcontent;
  const db = createDatabase(config.database);
  await db.init();

  try {
    const collections = query.collections 
      ? (query.collections as string).split(",")
      : undefined;
    
    const limit = query.limit ? parseInt(query.limit as string, 10) : 20;
    
    const results = await db.search(searchQuery, collections);
    
    return results.slice(0, limit);
  } finally {
    await db.close();
  }
});
