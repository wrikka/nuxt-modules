import { desc } from "drizzle-orm"
import { db } from "~~/server/db"
import { insertPostSchema, posts } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all posts
	if (method === "GET") {
		const allPosts = await db.query.posts.findMany({
			with: {
				author: {
					columns: { name: true, email: true },
				},
				postsToPostTags: {
					with: { tag: true },
				},
			},
			orderBy: [desc(posts.createdAt)],
		})
		return allPosts
	}

	// POST: Create a new post
	if (method === "POST") {
		const body = await readBody(event)
		const user = event.context.user
		if (!user) {
			throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
		}

		const validation = insertPostSchema.omit({ authorId: true }).safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid post data",
				data: validation.error.flatten(),
			})
		}

		const [newPost] = await db.insert(posts).values({
			...validation.data,
			authorId: user.id,
		}).returning()

		return { success: true, post: newPost }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
