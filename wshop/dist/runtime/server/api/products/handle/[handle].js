import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { products } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const handle = event.context.params?.handle;
  if (!handle) {
    throw createError({
      statusCode: 400,
      statusMessage: "Product handle is required"
    });
  }
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.handle, handle),
      with: {
        images: true,
        options: true,
        variants: true
      }
    });
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found"
      });
    }
    return product;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error fetching product with handle ${handle}:`, error);
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      const h3Error = error;
      throw createError({
        statusCode: h3Error.statusCode,
        statusMessage: h3Error.statusMessage
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch product: ${errorMessage}`
    });
  }
});
