import { createDatabase } from "../../../utils/database";
import type { H3Event } from "h3";

// GET /api/content/:collection/count
export default defineEventHandler(async (event: H3Event) => {
  const collection = getRouterParam(event, "collection");
  if (!collection) {
    throw createError({ statusCode: 400, statusMessage: "Collection required" });
  }

  const query = getQuery(event);
  const config = useRuntimeConfig().wcontent;
  
  const db = createDatabase(config.database);
  await db.init();

  try {
    let where;
    if (query.where) {
      where = JSON.parse(query.where as string);
    }

    const count = await db.count(collection, where);
    return { count };
  } finally {
    await db.close();
  }
});
