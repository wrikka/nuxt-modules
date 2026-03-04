import { createDatabase } from "../../../utils/database";
import type { QueryOptions } from "../../../../shared/types/collection";
import type { H3Event } from "h3";

// GET /api/content/:collection
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
    const options: QueryOptions = {};

    // Parse where clause
    if (query.where) {
      options.where = JSON.parse(query.where as string);
    }

    // Parse sort
    if (query.sort) {
      options.sort = JSON.parse(query.sort as string);
    }

    // Parse pagination
    if (query.skip) {
      options.skip = parseInt(query.skip as string, 10);
    }
    if (query.limit) {
      options.limit = parseInt(query.limit as string, 10);
    }

    // Parse field selection
    if (query.only) {
      options.only = (query.only as string).split(",");
    }
    if (query.without) {
      options.without = (query.without as string).split(",");
    }

    // Single item by path
    if (query.path) {
      const item = await db.findOne(collection, query.path as string);
      return item;
    }

    // List items
    const items = await db.find(collection, options);
    return items;
  } finally {
    await db.close();
  }
});
