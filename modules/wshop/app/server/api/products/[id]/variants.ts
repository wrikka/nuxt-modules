import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db/index"
import { productVariants } from "~~/server/db/schemas"

const variantSchema = z.object({
	sku: z.string().optional(),
	price: z.string(),
	stock: z.number().int().min(0),
	options: z.record(z.string()),
	imageId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const productId = getRouterParam(event, "id")
	const method = getMethod(event)

	if (!productId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID is required" })
	}

	// POST: Create a new variant for the product
	if (method === "POST") {
		const body = await readBody(event)
		const validation = variantSchema.safeParse(body)
		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid variant data",
				data: validation.error.flatten(),
			})
		}

		const [newVariant] = await db.insert(productVariants).values({
			...validation.data,
			productId,
		}).returning()

		return { success: true, variant: newVariant }
	}

	// PUT: Update an existing variant
	if (method === "PUT") {
		const { variantId, ...data } = await readBody(event)
		if (!variantId) {
			throw createError({ statusCode: 400, statusMessage: "Variant ID is required for update" })
		}

		const validation = variantSchema.partial().safeParse(data)
		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid variant data",
				data: validation.error.flatten(),
			})
		}

		const [updatedVariant] = await db.update(productVariants)
			.set(validation.data)
			.where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)))
			.returning()

		return { success: true, variant: updatedVariant }
	}

	// DELETE: Remove a variant
	if (method === "DELETE") {
		const { variantId } = await readBody(event)
		if (!variantId) {
			throw createError({ statusCode: 400, statusMessage: "Variant ID is required for deletion" })
		}

		await db.delete(productVariants)
			.where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)))

		return { success: true }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
