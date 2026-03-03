import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { insertProductSchema, products } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const productId = event.context.params?.id as string

	if (!productId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID is required" })
	}

	const body = await readBody(event)
	const validation = insertProductSchema.partial().safeParse(body)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product data",
			data: validation.error.flatten(),
		})
	}

	if (Object.keys(validation.data).length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "At least one field to update must be provided",
		})
	}

	try {
		const updatedProduct = await db
			.update(products)
			.set({ ...validation.data, updatedAt: new Date() })
			.where(eq(products.id, productId))
			.returning()

		if (updatedProduct.length === 0) {
			throw createError({ statusCode: 404, statusMessage: "Product not found" })
		}
		return updatedProduct[0]
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error updating product ${productId}:`, error)
		if (errorMessage.includes("duplicate key value violates unique constraint")) {
			throw createError({
				statusCode: 409,
				statusMessage: "A product with this handle already exists.",
			})
		}
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to update product: ${errorMessage}`,
		})
	}
})
