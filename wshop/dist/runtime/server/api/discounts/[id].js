import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { discounts, insertDiscountSchema } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const discountId = event.context.params?.id;
  if (!discountId) {
    throw createError({ statusCode: 400, statusMessage: "Discount ID is required" });
  }
  if (method === "GET") {
    try {
      const discount = await db.query.discounts.findFirst({
        where: eq(discounts.id, discountId)
      });
      if (!discount) {
        throw createError({ statusCode: 404, statusMessage: "Discount not found" });
      }
      return discount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error fetching discount ${discountId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch discount: ${errorMessage}`
      });
    }
  }
  if (method === "PUT") {
    const body = await readBody(event);
    const validation = insertDiscountSchema.partial().safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid discount data",
        data: validation.error.flatten()
      });
    }
    try {
      const updatedDiscount = await db.update(discounts).set(validation.data).where(eq(discounts.id, discountId)).returning();
      if (updatedDiscount.length === 0) {
        throw createError({ statusCode: 404, statusMessage: "Discount not found" });
      }
      return updatedDiscount[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error updating discount ${discountId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update discount: ${errorMessage}`
      });
    }
  }
  if (method === "DELETE") {
    try {
      const deletedDiscount = await db.delete(discounts).where(eq(discounts.id, discountId)).returning();
      if (deletedDiscount.length === 0) {
        throw createError({ statusCode: 404, statusMessage: "Discount not found" });
      }
      return { success: true, message: `Discount ${discountId} deleted` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error deleting discount ${discountId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to delete discount: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
