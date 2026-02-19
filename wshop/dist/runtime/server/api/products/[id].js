import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import * as schema from "~~/server/db/schemas";
const { products, insertProductSchema } = schema;
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const productId = getRouterParam(event, "id");
  if (!productId) {
    throw createError({ statusCode: 400, statusMessage: "Product ID is required" });
  }
  if (method === "GET") {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
          images: true,
          variants: true,
          options: true
        }
      });
      if (!product) {
        throw createError({ statusCode: 404, statusMessage: "Product not found" });
      }
      return product;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error fetching product ${productId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch product: ${errorMessage}`
      });
    }
  }
  if (method === "PUT") {
    const body = await readBody(event);
    const validation = insertProductSchema.partial().safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid product data",
        data: validation.error.flatten()
      });
    }
    if (Object.keys(validation.data).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one field to update must be provided"
      });
    }
    try {
      const updatedProduct = await db.update(products).set({ ...validation.data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, productId)).returning();
      if (updatedProduct.length === 0) {
        throw createError({ statusCode: 404, statusMessage: "Product not found" });
      }
      return updatedProduct[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error updating product ${productId}:`, error);
      if (errorMessage.includes("duplicate key value violates unique constraint")) {
        throw createError({
          statusCode: 409,
          statusMessage: "A product with this handle already exists."
        });
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update product: ${errorMessage}`
      });
    }
  }
  if (method === "DELETE") {
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
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
