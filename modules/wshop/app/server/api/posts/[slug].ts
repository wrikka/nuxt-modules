import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { insertPostSchema, posts } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	const slug = event.context.params?.slug as string

	if (!slug) {
		throw createError({ statusCode: 400, statusMessage: "Post slug is required" })
	}

	// GET: Fetch a single post by slug
	if (method === "GET") {
		const post = await db.query.posts.findFirst({
			where: eq(posts.slug, slug),
			with: {
				author: { columns: { name: true, email: true } },
				postsToPostTags: { with: { tag: true } },
			},
		})

		if (!post) {
			throw createError({ statusCode: 404, statusMessage: "Post not found" })
		}
		return post
	}

	// For PUT and DELETE, require authentication
	if (method === "PUT" || method === "DELETE") {
		const user = event.context.user
		if (!user) {
			throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
		}
	}

	// PUT: Update an existing post
	if (method === "PUT") {
		const body = await readBody(event)
		const validation = insertPostSchema.partial().omit({ authorId: true }).safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid post data",
				data: validation.error.flatten(),
			})
		}

		const [updatedPost] = await db.update(posts)
			.set({ ...validation.data, updatedAt: new Date() })
			.where(eq(posts.slug, slug))
			.returning()

		if (!updatedPost) {
			throw createError({ statusCode: 404, statusMessage: "Post not found" })
		}
		return { success: true, post: updatedPost }
	}

	// DELETE: Remove a post
	if (method === "DELETE") {
		const [deletedPost] = await db.delete(posts).where(eq(posts.slug, slug)).returning()
		if (!deletedPost) {
			throw createError({ statusCode: 404, statusMessage: "Post not found" })
		}
		return { success: true, message: `Post '${deletedPost.title}' deleted` }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
