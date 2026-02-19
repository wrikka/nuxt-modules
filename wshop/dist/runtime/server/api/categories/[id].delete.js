import { count, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { categories } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const categoryId = getRouterParam(event, "id");
  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Category ID is required"
    });
  }
  try {
    const [category] = await db.select({ id: categories.id }).from(categories).where(
      eq(categories.id, categoryId)
    );
    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found"
      });
    }
    const [childrenCountResult] = await db.select({ count: count() }).from(categories).where(
      eq(categories.parentId, categoryId)
    );
    if (!childrenCountResult || childrenCountResult.count > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot delete category with subcategories"
      });
    }
    await db.delete(categories).where(eq(categories.id, categoryId));
    return {
      success: true,
      message: "Category deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete category:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete category"
    });
  }
});
