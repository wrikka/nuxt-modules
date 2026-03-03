import { eq } from "drizzle-orm"
import { db } from "../db"
import { products } from "../db/schemas"

export const getProductById = async (id: string) => {
	const product = await db.query.products.findFirst({
		where: eq(products.id, id),
		with: {
			variants: true,
			images: true,
		},
	})
	return product
}

export const getProducts = async () => {
	const allProducts = await db.query.products.findMany({
		with: {
			variants: true,
			images: true,
		},
	})
	return allProducts
}

export const createProduct = async (data: any) => {
	const [product] = await db.insert(products).values(data).returning()
	return product
}

export const updateProduct = async (id: string, data: any) => {
	const [product] = await db
		.update(products)
		.set(data)
		.where(eq(products.id, id))
		.returning()
	return product
}

export const deleteProduct = async (id: string) => {
	await db.delete(products).where(eq(products.id, id))
}
