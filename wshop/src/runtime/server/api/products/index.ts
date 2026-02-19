import { db } from "~~/server/db"
import * as schema from "~~/server/db/schemas"

const { products, insertProductSchema } = schema

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: Fetch all products
	if (method === "GET") {
		try {
			const allProducts = await db.query.products.findMany({
				with: {
					images: true,
					variants: true,
					options: true,
				},
				orderBy: (products, { desc }) => [desc(products.createdAt)],
			})
			return allProducts
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching products:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch products: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new product
	if (method === "POST") {
		const body = await readBody(event)
		const validation = insertProductSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid product data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newProduct = await db.insert(products).values(validation.data).returning()
			return newProduct[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating product:", error)
			if (errorMessage.includes("duplicate key value violates unique constraint")) {
				throw createError({
					statusCode: 409,
					statusMessage: "A product with this handle already exists.",
				})
			}
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create product: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
