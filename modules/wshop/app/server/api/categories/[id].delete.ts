import { count, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { categories } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const categoryId = getRouterParam(event, "id") as string

	if (!categoryId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Category ID is required",
		})
	}

	try {
		// Check if the category exists
		const [category] = await db.select({ id: categories.id }).from(categories).where(
			eq(categories.id, categoryId),
		)
		if (!category) {
			throw createError({
				statusCode: 404,
				statusMessage: "Category not found",
			})
		}

		// Check if category has children
		const [childrenCountResult] = await db.select({ count: count() }).from(categories).where(
			eq(categories.parentId, categoryId),
		)

		if (!childrenCountResult || childrenCountResult.count > 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "Cannot delete category with subcategories",
			})
		}

		// Delete the category
		await db.delete(categories).where(eq(categories.id, categoryId))

		return {
			success: true,
			message: "Category deleted successfully",
		}
	} catch (error: any) {
		console.error("Failed to delete category:", error)
		if (error.statusCode) {
			throw error
		}
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to delete category",
		})
	}
})
