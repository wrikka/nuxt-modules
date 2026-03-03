// d:/wshop/server/api/pages/[id].ts

import { eq } from "drizzle-orm"
import { z } from "zod"
import { PageBlockSchema } from "~/shared/types"
import { db } from "~~/server/db"
import { pages } from "~~/server/db/schemas"

const updatePageSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	slug: z.string().min(1, "Slug is required").optional(),
	status: z.enum(["draft", "published"]).optional(),
	content: z.array(PageBlockSchema).optional(),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	const pageId = event.context.params?.id as string

	if (!pageId) {
		throw createError({ statusCode: 400, statusMessage: "Page ID is required" })
	}

	// GET: Fetch a single page by ID
	if (method === "GET") {
		try {
			const page = await db.query.pages.findFirst({
				where: eq(pages.id, pageId),
			})

			if (!page) {
				throw createError({ statusCode: 404, statusMessage: "Page not found" })
			}
			return page
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error fetching page ${pageId}:`, error)
			throw createError({ statusCode: 500, statusMessage: `Failed to fetch page: ${errorMessage}` })
		}
	}

	// PUT: Update an existing page
	if (method === "PUT") {
		const body = await readBody(event)
		const validation = updatePageSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid page data",
				data: validation.error.flatten(),
			})
		}

		try {
			const updatedPage = await db
				.update(pages)
				.set({ ...validation.data, updatedAt: new Date() })
				.where(eq(pages.id, pageId))
				.returning()

			if (updatedPage.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Page not found" })
			}
			return updatedPage[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error updating page ${pageId}:`, error)
			if (errorMessage.includes("duplicate key value violates unique constraint")) {
				throw createError({
					statusCode: 409,
					statusMessage: "A page with this slug already exists.",
				})
			}
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to update page: ${errorMessage}`,
			})
		}
	}

	// DELETE: Remove a page
	if (method === "DELETE") {
		try {
			const deletedPage = await db.delete(pages).where(eq(pages.id, pageId)).returning()
			if (deletedPage.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Page not found" })
			}
			return { success: true, message: `Page ${pageId} deleted` }
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error deleting page ${pageId}:`, error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to delete page: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
