import { db } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const categories = await db.query.categories.findMany({
      with: {
        children: true
      },
      where: (categories2, { isNull }) => isNull(categories2.parentId)
    });
    return categories;
  } catch (error) {
    console.error("Failed to load categories:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load categories"
    });
  }
});
