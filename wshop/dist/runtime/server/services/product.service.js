import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products } from "../db/schemas/index.js";
export const getProductById = async (id) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      variants: true,
      images: true
    }
  });
  return product;
};
export const getProducts = async () => {
  const allProducts = await db.query.products.findMany({
    with: {
      variants: true,
      images: true
    }
  });
  return allProducts;
};
export const createProduct = async (data) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};
export const updateProduct = async (id, data) => {
  const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return product;
};
export const deleteProduct = async (id) => {
  await db.delete(products).where(eq(products.id, id));
};
