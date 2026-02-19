import { createInsertSchema } from "drizzle-zod";
import { db } from "~~/server/db";
import { categories } from "~~/server/db/schemas";
const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = insertCategorySchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid category data",
      data: validation.error.flatten()
    });
  }
  try {
    const [newCategory] = await db.insert(categories).values(validation.data).returning();
    return newCategory;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create category"
    });
  }
});
