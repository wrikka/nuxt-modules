import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { db } from "~~/server/db";
import { categories } from "~~/server/db/schemas";
const updateCategorySchema = createInsertSchema(categories).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export default defineEventHandler(async (event) => {
  const categoryId = getRouterParam(event, "id");
  const body = await readBody(event);
  const validation = updateCategorySchema.safeParse(body);
  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Category ID is required"
    });
  }
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid category data",
      data: validation.error.flatten()
    });
  }
  try {
    const [updatedCategory] = await db.update(categories).set({ ...validation.data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(categories.id, categoryId)).returning();
    if (!updatedCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found"
      });
    }
    return updatedCategory;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update category"
    });
  }
});
