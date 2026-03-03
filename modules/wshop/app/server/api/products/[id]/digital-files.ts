import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db/index"
import { digitalProductFiles, products } from "~~/server/db/schemas"

const addFileSchema = z.object({
	fileName: z.string().min(1),
	fileUrl: z.string().url(),
	fileSize: z.number().int().positive().optional(),
})

const deleteFileSchema = z.object({
	fileId: z.string(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	const productId = event.context.params?.id as string

	if (!productId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID is required" })
	}

	// TODO: Add authentication to ensure only authorized staff can modify products

	// POST: Add a new digital file to the product
	if (method === "POST") {
		const body = await readBody(event)
		const validation = addFileSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid file data",
				data: validation.error.flatten(),
			})
		}

		// Verify the product exists and is a digital product
		const product = await db.query.products.findFirst({ where: eq(products.id, productId) })
		if (!product || product.type !== "digital") {
			throw createError({ statusCode: 404, statusMessage: "Digital product not found" })
		}

		const [newFile] = await db.insert(digitalProductFiles).values({
			...validation.data,
			productId,
		}).returning()

		return { success: true, file: newFile }
	}

	// DELETE: Remove a digital file from the product
	if (method === "DELETE") {
		const body = await readBody(event)
		const validation = deleteFileSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid request",
				data: validation.error.flatten(),
			})
		}

		const { fileId } = validation.data

		await db.delete(digitalProductFiles).where(
			and(
				eq(digitalProductFiles.id, fileId),
				eq(digitalProductFiles.productId, productId), // Ensure file belongs to the product
			),
		)

		return { success: true }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
