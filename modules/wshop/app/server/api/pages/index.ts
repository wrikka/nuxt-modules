// d:/wshop/server/api/pages/index.ts

import { z } from "zod"
import { PageBlockSchema } from "~/shared/types"
import { db } from "~~/server/db"
import { pages } from "~~/server/db/schemas"

const createPageSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	status: z.enum(["draft", "published"]).optional(),
	content: z.array(PageBlockSchema).optional(),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all pages
	if (method === "GET") {
		try {
			const allPages = await db.query.pages.findMany({
				orderBy: (pages, { desc }) => [desc(pages.createdAt)],
			})
			return allPages
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching pages:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch pages: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new page
	if (method === "POST") {
		const body = await readBody(event)
		const validation = createPageSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid page data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newPage = await db.insert(pages).values(validation.data).returning()
			return newPage[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating page:", error)
			// Handle potential unique constraint violation for slug
			if (errorMessage.includes("duplicate key value violates unique constraint")) {
				throw createError({
					statusCode: 409,
					statusMessage: "A page with this slug already exists.",
				})
			}
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create page: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
