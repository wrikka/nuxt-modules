import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { products } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const productId = event.context.params?.id;
  if (!productId) {
    throw createError({ statusCode: 400, statusMessage: "Product ID is required" });
  }
  try {
    const deletedProduct = await db.delete(products).where(eq(products.id, productId)).returning();
    if (deletedProduct.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }
    return { success: true, message: `Product ${productId} deleted` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error deleting product ${productId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete product: ${errorMessage}`
    });
  }
});
