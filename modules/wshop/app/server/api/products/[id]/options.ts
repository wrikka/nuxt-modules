import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db/index"
import { productOptions } from "~~/server/db/schemas"

const optionSchema = z.object({
	name: z.string().min(1),
	values: z.array(z.string().min(1)).min(1),
})

export default defineEventHandler(async (event) => {
	const productId = getRouterParam(event, "id")
	const method = getMethod(event)

	if (!productId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID is required" })
	}

	// POST: Create a new option for the product
	if (method === "POST") {
		const body = await readBody(event)
		const validation = optionSchema.safeParse(body)
		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid option data",
				data: validation.error.flatten(),
			})
		}

		const { values, ...rest } = validation.data
		const transformedValues = values.map(v => ({ label: v, value: v }))

		const [newOption] = await db.insert(productOptions).values({
			...rest,
			values: transformedValues,
			productId,
		}).returning()

		return { success: true, option: newOption }
	}

	// PUT: Update an existing option
	if (method === "PUT") {
		const { optionId, ...data } = await readBody(event)
		if (!optionId) {
			throw createError({ statusCode: 400, statusMessage: "Option ID is required for update" })
		}

		const validation = optionSchema.partial().safeParse(data)
		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid option data",
				data: validation.error.flatten(),
			})
		}

		const { values, ...rest } = validation.data
		const updateData: { name?: string; values?: { label: string; value: string }[] } = { ...rest }
		if (values) {
			updateData.values = values.map(v => ({ label: v, value: v }))
		}

		const [updatedOption] = await db.update(productOptions)
			.set(updateData)
			.where(and(eq(productOptions.id, optionId), eq(productOptions.productId, productId)))
			.returning()

		return { success: true, option: updatedOption }
	}

	// DELETE: Remove an option
	if (method === "DELETE") {
		const { optionId } = await readBody(event)
		if (!optionId) {
			throw createError({ statusCode: 400, statusMessage: "Option ID is required for deletion" })
		}

		// TODO: Also delete related variants or handle them appropriately
		await db.delete(productOptions)
			.where(and(eq(productOptions.id, optionId), eq(productOptions.productId, productId)))

		return { success: true }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
